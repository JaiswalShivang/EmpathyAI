const User = require('../models/User');
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
console.log('👨‍⚕️ Doctor Recommendation AI initialized successfully');

// Function to search doctors based on criteria
async function searchDoctors(criteria = {}) {
  try {
    const query = { role: 'DOCTOR', approved: true };

    // Add specialization filter
    if (criteria.specialization) {
      query['doctorProfile.specialization'] = {
        $regex: criteria.specialization,
        $options: 'i'
      };
    }

    // Add location filter
    if (criteria.location) {
      query.$or = [
        { 'doctorProfile.hospital': { $regex: criteria.location, $options: 'i' } },
        { 'doctorProfile.clinic': { $regex: criteria.location, $options: 'i' } }
      ];
    }

    // Add experience filter
    if (criteria.minExperience) {
      query['doctorProfile.experience'] = { $gte: criteria.minExperience };
    }

    // Add language filter
    if (criteria.language) {
      query['doctorProfile.languages'] = {
        $regex: criteria.language,
        $options: 'i'
      };
    }

    // Add fee range filter
    if (criteria.maxFee) {
      query['doctorProfile.consultationFee'] = { $lte: criteria.maxFee };
    }

    const doctors = await User.find(query)
      .select('name email doctorProfile')
      .sort({ 'doctorProfile.rating': -1, 'doctorProfile.experience': -1 })
      .limit(2);

    return doctors;
  } catch (error) {
    console.error('Error searching doctors:', error);
    return [];
  }
}

// Function to get doctor recommendations based on user query
async function getDoctorRecommendations(userQuery) {
  try {
    // First, analyze the user query to extract relevant criteria
    const criteria = await analyzeQueryForCriteria(userQuery);

    // Search doctors based on extracted criteria
    const doctors = await searchDoctors(criteria);

    if (doctors.length === 0) {
      return {
        message: "I couldn't find doctors matching your specific requirements. Let me help you find some general recommendations.",
        doctors: await getGeneralDoctorRecommendations()
      };
    }

    // Format the response
    const formattedDoctors = doctors.map(doctor => ({
      name: doctor.name,
      specialization: doctor.doctorProfile?.specialization?.join(', ') || 'General Practice',
      experience: doctor.doctorProfile?.experience || 'N/A',
      hospital: doctor.doctorProfile?.hospital || doctor.doctorProfile?.clinic || 'N/A',
      consultationFee: doctor.doctorProfile?.consultationFee || 'N/A',
      rating: doctor.doctorProfile?.rating || 'N/A',
      languages: doctor.doctorProfile?.languages?.join(', ') || 'English',
      bio: doctor.doctorProfile?.bio || 'Experienced healthcare professional'
    }));

    return {
      message: `Based on your query, here are the top recommended doctors:`,
      doctors: formattedDoctors.slice(0, 2), // Return top 2 recommendations
      criteria: criteria
    };

  } catch (error) {
    console.error('Error getting doctor recommendations:', error);
    return {
      message: "I'm having trouble accessing doctor information right now. Please try again later.",
      doctors: []
    };
  }
}

// Function to analyze user query and extract search criteria
async function analyzeQueryForCriteria(userQuery) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: 'user',
        parts: [{ text: userQuery }]
      }],
      config: {
        systemInstruction: `
You are an expert at analyzing doctor search queries. Extract the following information from the user's query and return it as a JSON object:

Required fields to extract:
- specialization: The medical specialty they're looking for (e.g., "cardiology", "psychiatry", "dermatology")
- location: Any location mentioned (city, hospital name, clinic name)
- minExperience: Minimum years of experience (if mentioned)
- language: Preferred language for consultation
- maxFee: Maximum consultation fee they're willing to pay
- urgency: How urgent is their need ("immediate", "soon", "routine")

Return ONLY a valid JSON object with these fields. Use null for fields that aren't mentioned.

Examples:
Query: "I need a cardiologist in Mumbai with 5+ years experience"
Result: {"specialization": "cardiology", "location": "Mumbai", "minExperience": 5, "language": null, "maxFee": null, "urgency": "routine"}

Query: "Find me a psychiatrist who speaks Hindi under 2000 rupees"
Result: {"specialization": "psychiatry", "location": null, "minExperience": null, "language": "Hindi", "maxFee": 2000, "urgency": "routine"}
        `,
      },
    });

    let jsonText = response.text.trim();

    // Handle markdown code blocks
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const result = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.error('Error analyzing query:', error);
    return {
      specialization: null,
      location: null,
      minExperience: null,
      language: null,
      maxFee: null,
      urgency: 'routine'
    };
  }
}

// Function to get general doctor recommendations when no specific criteria match
async function getGeneralDoctorRecommendations() {
  try {
    const doctors = await User.find({ role: 'DOCTOR', approved: true })
      .select('name email doctorProfile')
      .sort({ 'doctorProfile.rating': -1 })
      .limit(3);

    return doctors.slice(0, 2).map(doctor => ({
      name: doctor.name,
      specialization: doctor.doctorProfile?.specialization?.join(', ') || 'General Practice',
      experience: doctor.doctorProfile?.experience || 'N/A',
      hospital: doctor.doctorProfile?.hospital || doctor.doctorProfile?.clinic || 'N/A',
      consultationFee: doctor.doctorProfile?.consultationFee || 'N/A',
      rating: doctor.doctorProfile?.rating || 'N/A',
      languages: doctor.doctorProfile?.languages?.join(', ') || 'English',
      bio: doctor.doctorProfile?.bio || 'Experienced healthcare professional'
    }));
  } catch (error) {
    console.error('Error getting general recommendations:', error);
    return [];
  }
}

// Function to get doctor details by ID
async function getDoctorById(doctorId) {
  try {
    const doctor = await User.findById(doctorId)
      .select('name email doctorProfile');

    if (!doctor || doctor.role !== 'DOCTOR') {
      return null;
    }

    return {
      name: doctor.name,
      specialization: doctor.doctorProfile?.specialization?.join(', ') || 'General Practice',
      experience: doctor.doctorProfile?.experience || 'N/A',
      qualifications: doctor.doctorProfile?.qualifications?.join(', ') || 'N/A',
      hospital: doctor.doctorProfile?.hospital || doctor.doctorProfile?.clinic || 'N/A',
      consultationFee: doctor.doctorProfile?.consultationFee || 'N/A',
      rating: doctor.doctorProfile?.rating || 'N/A',
      languages: doctor.doctorProfile?.languages?.join(', ') || 'English',
      bio: doctor.doctorProfile?.bio || 'Experienced healthcare professional',
      availability: doctor.doctorProfile?.availability || {}
    };
  } catch (error) {
    console.error('Error getting doctor details:', error);
    return null;
  }
}

// Function to format doctor information for AI responses
function formatDoctorForResponse(doctor) {
  return `**${doctor.name}**
- **Specialization**: ${doctor.specialization}
- **Experience**: ${doctor.experience} years
- **Hospital/Clinic**: ${doctor.hospital}
- **Consultation Fee**: ₹${doctor.consultationFee}
- **Rating**: ${doctor.rating}/5 ⭐
- **Languages**: ${doctor.languages}
- **About**: ${doctor.bio}`;
}

module.exports = {
  getDoctorRecommendations,
  getDoctorById,
  searchDoctors,
  formatDoctorForResponse
};