import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with environment variable
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface ParsedResumeData {
  personal?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  experience?: Array<{
    role: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }>;
  education?: Array<{
    school: string;
    degree: string;
    field: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
    description?: string;
  }>;
  skills?: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    role?: string;
    url?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    technologies?: string;
  }>;
  languages?: Array<{
    name: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }>;
  awards?: Array<{
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  volunteer?: Array<{
    organization: string;
    role: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }>;
  publications?: Array<{
    title: string;
    publisher: string;
    date: string;
    authors?: string;
    url?: string;
  }>;
  courses?: Array<{
    name: string;
    institution: string;
    completionDate: string;
    description?: string;
  }>;
}

/**
 * Parse resume text using Gemini AI for intelligent extraction
 */
export async function parseResumeWithAI(text: string): Promise<ParsedResumeData> {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.');
  }

  try {
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert resume parser. Analyze the following resume text and extract all relevant information in a structured JSON format.

Resume Text:
${text}

Extract and return ONLY a valid JSON object with the following structure (include only sections that have data):
{
  "personal": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, State",
    "linkedin": "linkedin.com/in/username",
    "website": "website.com"
  },
  "summary": "Professional summary text",
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": "Job responsibilities and achievements"
    }
  ],
  "education": [
    {
      "school": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "location": "City, State",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "gpa": "3.8",
      "description": "Relevant coursework or achievements"
    }
  ],
  "skills": [
    {
      "name": "Skill Name",
      "level": "expert"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "YYYY-MM",
      "expiryDate": "YYYY-MM",
      "credentialId": "ID123",
      "url": "credential-url"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "role": "Your Role",
      "url": "project-url",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "technologies": "Tech stack used"
    }
  ],
  "languages": [
    {
      "name": "Language",
      "proficiency": "fluent"
    }
  ],
  "awards": [
    {
      "title": "Award Title",
      "issuer": "Issuing Organization",
      "date": "YYYY-MM",
      "description": "Award description"
    }
  ],
  "volunteer": [
    {
      "organization": "Organization Name",
      "role": "Volunteer Role",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "description": "Volunteer work description"
    }
  ],
  "publications": [
    {
      "title": "Publication Title",
      "publisher": "Publisher Name",
      "date": "YYYY-MM",
      "authors": "Author Names",
      "url": "publication-url"
    }
  ],
  "courses": [
    {
      "name": "Course Name",
      "institution": "Institution Name",
      "completionDate": "YYYY-MM",
      "description": "Course description"
    }
  ]
}

Important:
- Return ONLY the JSON object, no additional text or markdown formatting
- Use YYYY-MM format for all dates
- Set "current" to true for ongoing positions/education
- Extract as much detail as possible
- If a section has no data, omit it entirely
- Infer skill levels based on context (years of experience, role level, etc.)
- Infer language proficiency based on context`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean the response to extract JSON
    let jsonText = responseText.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsedData = JSON.parse(jsonText) as ParsedResumeData;
    return parsedData;
  } catch (error) {
    console.error('Error parsing resume with AI:', error);
    throw new Error('Failed to parse resume with AI. Please try again.');
  }
}

/**
 * Improve resume content using AI suggestions
 */
export async function improveResumeContent(section: string, content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert resume writer and career coach. Improve the following ${section} section of a resume to make it more impactful, professional, and ATS-friendly.

Current Content:
${content}

Guidelines:
- Use strong action verbs
- Quantify achievements where possible
- Make it concise and impactful
- Ensure ATS compatibility
- Keep the tone professional
- Preserve the original meaning and facts

Return ONLY the improved text without any additional commentary or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error improving content with AI:', error);
    throw new Error('Failed to improve content. Please try again.');
  }
}

/**
 * Match resume to job description and provide suggestions
 */
export async function matchJobDescription(resumeData: ParsedResumeData, jobDescription: string): Promise<{
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert ATS (Applicant Tracking System) and career advisor. Analyze how well this resume matches the job description.

Resume Summary:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Provide a detailed analysis in the following JSON format:
{
  "score": 85,
  "strengths": ["List of matching qualifications and strengths"],
  "gaps": ["List of missing qualifications or areas to improve"],
  "suggestions": ["Specific actionable suggestions to improve the resume for this job"]
}

Return ONLY the JSON object without any additional text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonText = response.text().trim();
    
    // Clean the response
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error matching job description:', error);
    throw new Error('Failed to analyze job match. Please try again.');
  }
}

/**
 * Generate professional summary based on resume data
 */
export async function generateSummary(resumeData: Partial<ParsedResumeData>): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert resume writer. Based on the following resume information, generate a compelling professional summary (3-4 sentences) that highlights key strengths, experience, and value proposition.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return ONLY the professional summary text without any additional commentary or formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary. Please try again.');
  }
}
