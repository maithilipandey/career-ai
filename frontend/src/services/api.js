const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function analyzeResume(file, jobDescription) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    const response = await fetch(`${API_BASE_URL}/parse/resume`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to analyze resume.");
    }

    return await response.json();
}

export async function generateInterviewQuestions(username, targetRole, missingSkills) {
    const response = await fetch(`${API_BASE_URL}/interview/generate-questions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            target_role: targetRole,
            missing_skills: missingSkills
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate interview questions.");
    }

    return await response.json();
}
