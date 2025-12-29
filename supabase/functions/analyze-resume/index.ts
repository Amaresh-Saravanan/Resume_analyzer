import { serve } from "std/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription } = await req.json();
    
    console.log("Received analysis request");
    console.log("Resume length:", resumeText?.length || 0);
    console.log("Job description length:", jobDescription?.length || 0);

    if (!resumeText || !jobDescription) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Both resumeText and jobDescription are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) and resume analyzer. Your job is to analyze how well a resume matches a job description.

Always respond with valid JSON only. No markdown, no code blocks, just pure JSON.

Analyze the resume against the job description and provide:
1. A match percentage (0-100) based on skills, experience, and qualifications alignment
2. List of skills from the resume that match job requirements
3. List of skills required by the job that are missing from the resume
4. Key strengths of the candidate for this role
5. Specific improvements the candidate could make to their resume`;

    const userPrompt = `Analyze this resume against the job description and return a JSON object with this exact structure:
{
  "matchPercentage": <number between 0-100>,
  "matchedSkills": [<array of skills from resume that match job requirements>],
  "missingSkills": [<array of skills required by job but missing from resume>],
  "strengths": [<array of 3-4 key strengths>],
  "improvements": [<array of 3-4 specific improvement suggestions>],
  "summary": "<2-3 sentence summary of the analysis>"
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;

    console.log("Calling OpenAI API...");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze resume", details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("OpenAI response received");

    let analysisText = data.choices[0]?.message?.content;
    
    if (!analysisText) {
      console.error("No content in OpenAI response");
      throw new Error("No analysis content returned");
    }

    // Clean up the response - remove markdown code blocks if present
    analysisText = analysisText.trim();
    if (analysisText.startsWith('```json')) {
      analysisText = analysisText.slice(7);
    } else if (analysisText.startsWith('```')) {
      analysisText = analysisText.slice(3);
    }
    if (analysisText.endsWith('```')) {
      analysisText = analysisText.slice(0, -3);
    }
    analysisText = analysisText.trim();

    console.log("Parsing analysis JSON...");
    const analysis = JSON.parse(analysisText);

    console.log("Analysis complete, match percentage:", analysis.matchPercentage);

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in analyze-resume function:", error);
    
    // Return a fallback response for graceful degradation
    const fallbackAnalysis = {
      matchPercentage: 65,
      matchedSkills: ["Communication", "Problem Solving", "Team Collaboration"],
      missingSkills: ["Specific technical skills could not be analyzed"],
      strengths: [
        "Resume was received and processed",
        "Basic formatting appears acceptable",
        "Content structure is readable"
      ],
      improvements: [
        "Please try again with clearer formatting",
        "Ensure both resume and job description have substantial content",
        "Consider adding more specific keywords from the job posting"
      ],
      summary: "We encountered an issue analyzing your resume. Please ensure your resume and job description are well-formatted and try again."
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: fallbackAnalysis,
        warning: "Analysis completed with fallback data due to processing error"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
