export const introductions = {
  explore: "Hi, I'm your CSH study companion. I can help you understand our services and prepare for your study-abroad journey.\n\nWhere would you like to study, and what subject interests you?",
  consult: "Let's prepare for a conversation with a CSH adviser. Tell me what you would like help with, or choose ‘Request a consultation’ to suggest a time.\n\nYour adviser will confirm availability personally.",
  support: "Welcome back. I can help explain CSH's services and prepare questions for your adviser.\n\nFor a personal application update, use ‘Talk on WhatsApp’ or the enquiry form. I don't have access to individual application records."
};
export const suggestions = {
  explore: ['Help me choose a destination', 'Do you help with scholarships?', 'How do I start?'],
  consult: ['What should I prepare?', 'Is my appointment confirmed?', 'How can I contact CSH?'],
  support: ['Check my application status', 'Help with my documents', 'Prepare for departure']
};
export function demoReply(text, mode) {
  const q = text.toLowerCase();
  if (/status|update|track|reference|my application/.test(q)) return "Your CSH adviser can check your individual application. This assistant isn't connected to student records. Please use ‘Talk on WhatsApp’ or ‘Send an enquiry’ to request an update. Avoid sharing passports, financial records or other sensitive documents in this chat.";
  if (/guarantee|certain|100%/.test(q)) return "CSH can help you prepare, but admission, scholarship and visa decisions are made by the relevant institutions and authorities. No outcome can be guaranteed. An adviser can discuss your circumstances and the next steps.";
  if (/confirm|booked|appointment/.test(q)) return "A consultation request is not a confirmed appointment. Choose ‘Request a consultation’ to prepare an email with your preferred time and time zone. Your CSH adviser will reply to confirm availability.";
  if (/scholar|funding|financial aid/.test(q)) return "CSH offers scholarship guidance: identifying relevant opportunities, understanding eligibility and preparing submissions. Awards and deadlines vary, so your adviser needs to check the current details.\n\nWhich destination and level of study interest you?";
  if (/visa|passport/.test(q)) return "CSH provides student visa support and passport application guidance, including organizing documents and preparing for interviews. Official requirements and decisions come from the relevant authorities.\n\nWhich destination are you considering? Your adviser can help check the current requirements.";
  if (/departure|travel|arrival|accommodation/.test(q)) return "CSH's pre-departure support covers travel planning, accommodation, budgeting and arrival preparation.\n\nTell your adviser where and when you plan to study, so they can help with the practical next steps.";
  if (/cost|price|fees|how much|budget/.test(q)) return "I don't have an approved price list or current university tuition figures. A CSH adviser can discuss your budget and verify costs for suitable options.\n\nWhat destination, course and approximate budget are you considering?";
  if (/prepare|document|requirements/.test(q)) return "For a useful first conversation, have your intended subject, study level, destinations, approximate budget and target intake in mind. CSH can then help clarify the application documents needed for your specific choices.\n\nPlease share sensitive documents only through a secure channel agreed with your adviser.";
  if (/contact|human|adviser|advisor|email|whatsapp/.test(q)) return "You can reach CSH at studyabroad@cshconsultancy.com or on WhatsApp at +44 7867 015373. Use the buttons below to choose your next step.\n\nA consultation request will be confirmed by your adviser.";
  if (/destination|country|countries|choose/.test(q)) return "CSH supports options in the UK, Canada, USA, Australia, New Zealand and several European destinations. Choosing well depends on your subject, qualifications, budget and goals.\n\nWhat would you like to study, and at what level?";
  if (/start|apply|admission/.test(q)) return "Start by sharing your study goals with CSH. An adviser can help compare institutions and courses, review requirements, prepare an application and keep track of deadlines.\n\nWhat course, destination and intake do you have in mind?";
  return mode === 'consult' ? "An adviser can help you work through that. Choose ‘Request a consultation’ to suggest a date, time and topic. You will review the email before sending it, and CSH will confirm availability.\n\nThis preview uses sample replies; the installed assistant can generate personalized responses once its AI connection is configured." : "Thanks for sharing. An adviser can use your intended course, study level, destination, budget and intake to help plan your next steps.\n\nThis preview uses sample replies. The installed assistant can respond to your individual question once its AI connection is configured. You can also contact CSH using the links below.";
}
export function bookingMailto(values) {
  const body = `Hello CSH Consultancy,\n\nI would like to request a consultation.\n\nName: ${values.name}\nEmail: ${values.email}\nPreferred date: ${values.date}\nPreferred time: ${values.time}\nTime zone: ${values.timezone}\nTopic: ${values.topic}\n\nPlease confirm availability or suggest another time. I understand this is a request, not a confirmed booking.\n\nThank you.`;
  return 'mailto:studyabroad@cshconsultancy.com?subject=' + encodeURIComponent('Consultation request — CSH Consultancy') + '&body=' + encodeURIComponent(body);
}
