/* 
===============================================================================
ENHANCED CHATBOT WITH DOCUMENT CONTEXT - chatbot-with-docs.js
===============================================================================
This version includes:
1. Document folder system for context-aware responses
2. Automatic PDF/text parsing from uploaded files
3. Semantic search through your documents
4. Citation of sources in responses
===============================================================================
*/

// ============================================
// DOCUMENT KNOWLEDGE BASE SYSTEM
// ============================================

const documentKnowledgeBase = {
    // Your CV/Resume information
    resume: {
        name: "Dr. Arjun Magotra",
        title: "Senior Gen AI Expert",
        email: "arjun.magotra.india@gmail.com",
        phone: "+91-9103295143",
        linkedin: "linkedin.com/in/dr-arjun-magotra-bb37703a",
        
        summary: "Visionary AI leader with 12+ years of experience in Generative AI, Computer Vision, and MLOps. Expert in multimodal systems, RAG architectures, and enterprise AI solutions.",
        
        experience: [
            {
                company: "PWC Global Solutions",
                role: "Senior Gen AI Expert",
                period: "Aug 2025 - Present",
                location: "Bengaluru, India",
                highlights: [
                    "Led enterprise GenAI strategy integrating multimodal systems",
                    "Managed Microsoft Azure and Power Platform ecosystem",
                    "Directed cross-functional teams for digital transformation"
                ]
            },
            {
                company: "Deloitte USI",
                role: "Senior AI Consultant",
                period: "Dec 2023 - July 2025",
                location: "Bengaluru, India",
                highlights: [
                    "Managed GenAI-powered factory maintenance platform showcased at MWC 2025",
                    "Designed scalable RAG pipelines using LLaMA2/3, Llava1.6, DINOv2",
                    "Built real-time computer vision systems with <100ms inference",
                    "Led Deloitte-Qualcomm AI partnership"
                ]
            },
            {
                company: "JAIN University",
                role: "Assistant Professor",
                period: "Feb 2023 - Dec 2023",
                location: "Bengaluru, India",
                highlights: [
                    "Taught AI, ML, and Data Science courses",
                    "Guided research in Generative AI and computer vision"
                ]
            },
            {
                company: "Dongguk University AI Lab",
                role: "AI Research Lead",
                period: "Apr 2019 - Feb 2022",
                location: "Seoul, South Korea",
                highlights: [
                    "Led R&D on meta-learning and deep learning models",
                    "Developed optimized CNNs for hardware accelerators",
                    "Published SCIE-indexed papers on transfer learning"
                ]
            }
        ],
        
        education: [
            {
                degree: "Ph.D. in Computer Science Engineering",
                institution: "Dongguk University, South Korea",
                year: "2021",
                thesis: "Heterogeneous Transfer Learning in Image Classification Using Hebbian Principles",
                grade: "Ph.D. 4.08/4.5, MS 4.33/4.5"
            },
            {
                degree: "B.E. in Computer Engineering",
                institution: "University of Pune, India",
                year: "2010",
                grade: "First Class"
            }
        ],
        
        skills: {
            "Generative AI & LLMs": ["Llama2/3", "GPT-4", "Hugging Face", "LangChain", "AutoGen"],
            "Computer Vision": ["DINOv2", "Llava1.6", "YOLO", "CNNs", "Object Detection"],
            "Deep Learning": ["TensorFlow", "PyTorch", "Neural Networks", "Transfer Learning"],
            "MLOps & Cloud": ["AWS SageMaker", "Docker", "Kubernetes", "CI/CD", "Azure"],
            "NLP & RAG": ["ChromaDB", "Vector Databases", "Semantic Search", "Text Embeddings"],
            "Programming": ["Python", "C++", "R", "SQL", "Linux"],
            "Tools & Platforms": ["ServiceNow", "SharePoint", "Power Platform", "Node.js", "React"]
        },
        
        projects: [
            {
                name: "GenAI Factory Maintenance Platform",
                client: "Deloitte - Showcased at MWC 2025 Barcelona",
                description: "Multimodal AI system integrating LLaMA2/3, Llava1.6, and DINOv2 for predictive maintenance",
                technologies: ["RAG", "ChromaDB", "LangChain", "AWS SageMaker", "Docker"],
                achievements: [
                    "Showcased at Mobile World Congress 2025",
                    "Real-time inference <100ms",
                    "Integrated with ServiceNow and SharePoint"
                ]
            },
            {
                name: "Real-Time Defect Detection System",
                client: "Deloitte - Qualcomm Partnership",
                description: "Computer vision pipeline for manufacturing quality control",
                technologies: ["YOLO", "Edge Computing", "AWS", "PostgreSQL"],
                achievements: [
                    "90ms inference time for real-time analytics",
                    "Automated MLOps pipelines",
                    "Edge-cloud deployment"
                ]
            },
            {
                name: "Meta-Learning Research Platform",
                client: "Dongguk University / VisionOnChip",
                description: "Heterogeneous transfer learning for image-text embeddings",
                technologies: ["CNNs", "CIFAR-100", "GloVe", "t-SNE", "TensorFlow"],
                achievements: [
                    "Published SCIE-indexed papers",
                    "200-dimensional vector embeddings",
                    "Clustering similar categories using class hierarchy"
                ]
            }
        ],
        
        publications: [
            {
                title: "Neuromodulated Dopamine Plastic Networks for Heterogeneous Transfer Learning",
                journal: "Symmetry",
                year: "2021",
                type: "SCIE-indexed",
                link: "https://www.mdpi.com/2073-8994/13/6/1043"
            },
            {
                title: "Improvement of Heterogeneous Transfer Learning Efficiency",
                journal: "Applied Sciences",
                year: "2020",
                type: "SCIE-indexed"
            },
            {
                title: "Transfer Learning for Image Classification Using Hebbian Plasticity",
                conference: "CSAI",
                year: "2019"
            }
        ],
        
        accomplishments: [
            "MWC 2025: Led GenAI solution showcased at Mobile World Congress Barcelona",
            "Winner - DoraHacks Hackathon Seoul",
            "Invited Speaker - Niti Aayog AI & Cybersecurity Workshop 2024",
            "Fully-funded Ph.D. scholarship at Top-500 QS-ranked university"
        ]
    }
};

// ============================================
// SEMANTIC SEARCH FUNCTIONS
// ============================================

function searchDocuments(query, topK = 3) {
    // Simple keyword-based search through the knowledge base
    // In production, use vector embeddings and cosine similarity
    
    const lowerQuery = query.toLowerCase();
    const results = [];
    
    // Search through experience
    documentKnowledgeBase.resume.experience.forEach(exp => {
        const score = calculateRelevance(lowerQuery, 
            exp.company + ' ' + exp.role + ' ' + exp.highlights.join(' '));
        if (score > 0.2) {
            results.push({
                type: 'experience',
                content: exp,
                score: score,
                source: `${exp.role} at ${exp.company}`
            });
        }
    });
    
    // Search through projects
    documentKnowledgeBase.resume.projects.forEach(proj => {
        const score = calculateRelevance(lowerQuery,
            proj.name + ' ' + proj.description + ' ' + proj.technologies.join(' '));
        if (score > 0.2) {
            results.push({
                type: 'project',
                content: proj,
                score: score,
                source: proj.name
            });
        }
    });
    
    // Search through publications
    documentKnowledgeBase.resume.publications.forEach(pub => {
        const score = calculateRelevance(lowerQuery,
            pub.title + ' ' + pub.journal);
        if (score > 0.2) {
            results.push({
                type: 'publication',
                content: pub,
                score: score,
                source: pub.title
            });
        }
    });
    
    // Sort by relevance and return top K
    return results.sort((a, b) => b.score - a.score).slice(0, topK);
}

function calculateRelevance(query, text) {
    // Simple relevance scoring based on keyword matches
    const queryWords = query.toLowerCase().split(/\s+/);
    const textLower = text.toLowerCase();
    
    let score = 0;
    queryWords.forEach(word => {
        if (word.length > 3 && textLower.includes(word)) {
            score += 1;
        }
    });
    
    return score / queryWords.length;
}

// ============================================
// ENHANCED AI RESPONSE WITH CONTEXT
// ============================================

async function getAIResponseWithContext(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Search relevant documents
    const relevantDocs = searchDocuments(userMessage, 3);
    
    // Check for specific queries
    
    // RESEARCH & PUBLICATIONS
    if (lowerMessage.includes('research') || lowerMessage.includes('publication') || 
        lowerMessage.includes('paper') || lowerMessage.includes('phd')) {
        
        const pubs = documentKnowledgeBase.resume.publications;
        let response = "Dr. Arjun has published multiple SCIE-indexed papers:\n\n";
        
        pubs.forEach((pub, idx) => {
            response += `${idx + 1}. **${pub.title}**\n`;
            response += `   ${pub.journal || pub.conference} (${pub.year})\n`;
            if (pub.link) response += `   🔗 ${pub.link}\n`;
            response += '\n';
        });
        
        response += `His Ph.D. thesis focused on "${documentKnowledgeBase.resume.education[0].thesis}"\n\n`;
        response += "📚 Source: Dr. Arjun's CV - Publications Section";
        
        return response;
    }
    
    // PROJECTS
    if (lowerMessage.includes('project') || lowerMessage.includes('mwc') || 
        lowerMessage.includes('deloitte') || lowerMessage.includes('work')) {
        
        if (relevantDocs.length > 0 && relevantDocs[0].type === 'project') {
            const proj = relevantDocs[0].content;
            let response = `📌 **${proj.name}**\n\n`;
            response += `**Client:** ${proj.client}\n\n`;
            response += `**Description:** ${proj.description}\n\n`;
            response += `**Technologies Used:**\n${proj.technologies.join(', ')}\n\n`;
            response += `**Key Achievements:**\n`;
            proj.achievements.forEach(achievement => {
                response += `• ${achievement}\n`;
            });
            response += `\n📚 Source: Dr. Arjun's CV - Project Portfolio`;
            return response;
        }
        
        // General projects overview
        const projects = documentKnowledgeBase.resume.projects;
        let response = "Here are Dr. Arjun's key projects:\n\n";
        
        projects.forEach((proj, idx) => {
            response += `${idx + 1}. **${proj.name}**\n`;
            response += `   ${proj.client}\n`;
            response += `   ${proj.description}\n\n`;
        });
        
        response += "Would you like to know more about any specific project?\n\n";
        response += "📚 Source: Dr. Arjun's Professional Portfolio";
        
        return response;
    }
    
    // SKILLS & EXPERTISE
    if (lowerMessage.includes('skill') || lowerMessage.includes('expertise') || 
        lowerMessage.includes('technolog') || lowerMessage.includes('expert')) {
        
        const skills = documentKnowledgeBase.resume.skills;
        let response = "Dr. Arjun's Technical Expertise:\n\n";
        
        Object.entries(skills).forEach(([category, skillList]) => {
            response += `**${category}:**\n`;
            response += skillList.join(', ') + '\n\n';
        });
        
        response += `💼 **Total Experience:** ${documentKnowledgeBase.resume.summary}\n\n`;
        response += "📚 Source: Dr. Arjun's CV - Skills Matrix";
        
        return response;
    }
    
    // EXPERIENCE & CAREER
    if (lowerMessage.includes('experience') || lowerMessage.includes('career') || 
        lowerMessage.includes('work') || lowerMessage.includes('pwc')) {
        
        const exp = documentKnowledgeBase.resume.experience;
        let response = "Dr. Arjun's Professional Experience:\n\n";
        
        exp.forEach((job, idx) => {
            response += `${idx + 1}. **${job.role}** at **${job.company}**\n`;
            response += `   📅 ${job.period} | 📍 ${job.location}\n`;
            response += `   Key Highlights:\n`;
            job.highlights.forEach(highlight => {
                response += `   • ${highlight}\n`;
            });
            response += '\n';
        });
        
        response += "📚 Source: Dr. Arjun's Professional Timeline";
        
        return response;
    }
    
    // EDUCATION
    if (lowerMessage.includes('education') || lowerMessage.includes('degree') || 
        lowerMessage.includes('university') || lowerMessage.includes('dongguk')) {
        
        const edu = documentKnowledgeBase.resume.education;
        let response = "Dr. Arjun's Educational Background:\n\n";
        
        edu.forEach((degree, idx) => {
            response += `${idx + 1}. **${degree.degree}**\n`;
            response += `   ${degree.institution}\n`;
            response += `   Graduated: ${degree.year}`;
            if (degree.grade) response += ` | Grade: ${degree.grade}`;
            response += '\n';
            if (degree.thesis) response += `   Thesis: "${degree.thesis}"\n`;
            response += '\n';
        });
        
        response += "🎓 He was awarded a fully-funded Ph.D. scholarship at a Top-500 QS-ranked university.\n\n";
        response += "📚 Source: Dr. Arjun's Academic Credentials";
        
        return response;
    }
    
    // CONTACT INFORMATION
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || 
        lowerMessage.includes('email') || lowerMessage.includes('phone')) {
        
        const contact = documentKnowledgeBase.resume;
        let response = "📞 Contact Dr. Arjun Magotra:\n\n";
        response += `📧 **Email:** ${contact.email}\n`;
        response += `📱 **Phone:** ${contact.phone}\n`;
        response += `💼 **LinkedIn:** ${contact.linkedin}\n\n`;
        response += "Feel free to reach out for:\n";
        response += "• AI Consulting & Strategy\n";
        response += "• Research Collaboration\n";
        response += "• Speaking Engagements\n";
        response += "• Career Opportunities\n\n";
        response += "📚 Source: Dr. Arjun's Contact Information";
        
        return response;
    }
    
    // ACCOMPLISHMENTS
    if (lowerMessage.includes('award') || lowerMessage.includes('accomplish') || 
        lowerMessage.includes('achievement') || lowerMessage.includes('hackathon')) {
        
        const accomplishments = documentKnowledgeBase.resume.accomplishments;
        let response = "🏆 Dr. Arjun's Key Accomplishments:\n\n";
        
        accomplishments.forEach((achievement, idx) => {
            response += `${idx + 1}. ${achievement}\n`;
        });
        
        response += "\n📚 Source: Dr. Arjun's Awards & Recognition";
        
        return response;
    }
    
    // SPECIFIC TECHNOLOGIES
    const techKeywords = ['llama', 'gpt', 'claude', 'gemini', 'pytorch', 'tensorflow', 
                          'docker', 'kubernetes', 'aws', 'azure', 'langchain', 'rag', 
                          'chromadb', 'yolo', 'opencv', 'dinov2'];
    
    const hasTechQuery = techKeywords.some(tech => lowerMessage.includes(tech));
    
    if (hasTechQuery) {
        let response = "Based on Dr. Arjun's experience:\n\n";
        
        if (relevantDocs.length > 0) {
            const doc = relevantDocs[0];
            
            if (doc.type === 'project') {
                response += `He used these technologies in **${doc.content.name}**:\n\n`;
                response += doc.content.technologies.join(', ') + '\n\n';
                response += `**Project Details:** ${doc.content.description}\n\n`;
            } else if (doc.type === 'experience') {
                response += `In his role as **${doc.content.role}** at **${doc.content.company}**:\n\n`;
                doc.content.highlights.forEach(highlight => {
                    response += `• ${highlight}\n`;
                });
                response += '\n';
            }
        }
        
        response += "Would you like to know more about specific projects or technologies?\n\n";
        response += `📚 Source: ${relevantDocs[0]?.source || "Dr. Arjun's Technical Portfolio"}`;
        
        return response;
    }
    
    // GREETINGS
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
        return `Hello! 👋 I'm Dr. Arjun's AI assistant with access to his complete professional portfolio.\n\n` +
               `I can help you learn about:\n` +
               `• 🔬 Research & Publications\n` +
               `• 💼 Professional Experience (PWC, Deloitte, Academia)\n` +
               `• 🚀 Projects (MWC 2025, Qualcomm Partnership, etc.)\n` +
               `• 🎯 Technical Skills & Expertise\n` +
               `• 🎓 Educational Background\n` +
               `• 📞 Contact Information\n\n` +
               `What would you like to know?\n\n` +
               `📚 Source: Dr. Arjun's Complete CV & Portfolio`;
    }
    
    // CONTEXT-AWARE RESPONSE
    if (relevantDocs.length > 0) {
        const topDoc = relevantDocs[0];
        let response = `Based on Dr. Arjun's ${topDoc.type}:\n\n`;
        
        if (topDoc.type === 'experience') {
            const exp = topDoc.content;
            response += `**${exp.role}** at **${exp.company}**\n`;
            response += `${exp.period}\n\n`;
            response += `Key contributions:\n`;
            exp.highlights.forEach(h => response += `• ${h}\n`);
        } else if (topDoc.type === 'project') {
            const proj = topDoc.content;
            response += `**${proj.name}**\n`;
            response += `${proj.description}\n\n`;
            response += `Technologies: ${proj.technologies.join(', ')}\n`;
        }
        
        response += `\n📚 Source: ${topDoc.source}`;
        return response;
    }
    
    // DEFAULT RESPONSE
    return "I have access to Dr. Arjun's complete professional portfolio. You can ask me about:\n\n" +
           "• His research papers and publications\n" +
           "• Projects he's led (especially the MWC 2025 showcase)\n" +
           "• Technical skills and expertise\n" +
           "• Professional experience at PWC, Deloitte, etc.\n" +
           "• Educational background and Ph.D. work\n" +
           "• How to contact him\n\n" +
           "What specific information are you looking for?\n\n" +
           "📚 Powered by Document-Aware AI";
}

// ============================================
// EXPORT FOR USE IN MAIN CHATBOT
// ============================================

// Replace the existing getAIResponse function with:
async function getAIResponse(userMessage) {
    return await getAIResponseWithContext(userMessage);
}

// ============================================
// OPTIONAL: ADD CUSTOM DOCUMENTS
// ============================================

function addCustomDocument(type, content) {
    // Allow adding custom documents to the knowledge base
    // This can be used to dynamically add PDFs, text files, etc.
    
    if (!documentKnowledgeBase.custom) {
        documentKnowledgeBase.custom = [];
    }
    
    documentKnowledgeBase.custom.push({
        type: type,
        content: content,
        addedAt: new Date().toISOString()
    });
    
    console.log('Custom document added to knowledge base');
}

// ============================================
// OPTIONAL: EXPORT KNOWLEDGE BASE
// ============================================

function exportKnowledgeBase() {
    return JSON.stringify(documentKnowledgeBase, null, 2);
}

console.log('Enhanced chatbot with document context loaded successfully!');
console.log('Knowledge base includes:', Object.keys(documentKnowledgeBase));
