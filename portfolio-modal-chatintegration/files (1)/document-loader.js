/* 
===============================================================================
DOCUMENT LOADER SYSTEM - document-loader.js
===============================================================================
This script loads and parses documents from a /data folder for the chatbot
Supports: PDF, TXT, MD, JSON files
===============================================================================
*/

// ============================================
// DOCUMENT LOADER CLASS
// ============================================

class DocumentLoader {
    constructor() {
        this.documents = [];
        this.isLoaded = false;
        this.dataFolder = './data/'; // Folder containing your documents
    }

    // Load all documents from the data folder
    async loadAllDocuments() {
        console.log('📂 Loading documents from data folder...');
        
        try {
            // In a real implementation, you'd scan the folder
            // For now, we'll define the documents to load
            const documentsToLoad = [
                { name: 'resume.txt', type: 'txt' },
                { name: 'projects.json', type: 'json' },
                { name: 'research.md', type: 'md' }
                // Add more documents as needed
            ];

            for (const doc of documentsToLoad) {
                try {
                    await this.loadDocument(doc.name, doc.type);
                } catch (error) {
                    console.warn(`⚠️ Could not load ${doc.name}:`, error.message);
                }
            }

            this.isLoaded = true;
            console.log(`✅ Loaded ${this.documents.length} documents successfully`);
            
        } catch (error) {
            console.error('❌ Error loading documents:', error);
        }
    }

    // Load a single document
    async loadDocument(filename, type) {
        const filepath = this.dataFolder + filename;
        
        try {
            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let content;
            
            switch (type) {
                case 'txt':
                case 'md':
                    content = await response.text();
                    this.documents.push({
                        name: filename,
                        type: type,
                        content: content,
                        chunks: this.chunkText(content)
                    });
                    break;
                    
                case 'json':
                    content = await response.json();
                    this.documents.push({
                        name: filename,
                        type: type,
                        content: JSON.stringify(content, null, 2),
                        data: content,
                        chunks: this.chunkText(JSON.stringify(content))
                    });
                    break;
                    
                case 'pdf':
                    // For PDFs, you'd use a library like PDF.js
                    // This is a placeholder
                    console.log('PDF loading requires PDF.js library');
                    break;
            }
            
            console.log(`📄 Loaded: ${filename}`);
            
        } catch (error) {
            throw new Error(`Failed to load ${filename}: ${error.message}`);
        }
    }

    // Chunk text into smaller pieces for better search
    chunkText(text, chunkSize = 500) {
        const chunks = [];
        const sentences = text.split(/[.!?]+/);
        let currentChunk = '';
        
        for (const sentence of sentences) {
            if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = sentence;
            } else {
                currentChunk += sentence + '. ';
            }
        }
        
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }
        
        return chunks;
    }

    // Search through all documents
    search(query, topK = 3) {
        if (!this.isLoaded) {
            console.warn('⚠️ Documents not loaded yet');
            return [];
        }

        const results = [];
        const queryLower = query.toLowerCase();
        
        // Search through each document
        this.documents.forEach(doc => {
            doc.chunks.forEach((chunk, index) => {
                const score = this.calculateSimilarity(queryLower, chunk.toLowerCase());
                
                if (score > 0.1) {
                    results.push({
                        document: doc.name,
                        chunk: chunk,
                        score: score,
                        index: index
                    });
                }
            });
        });
        
        // Sort by relevance and return top K
        return results.sort((a, b) => b.score - a.score).slice(0, topK);
    }

    // Calculate similarity between query and text
    calculateSimilarity(query, text) {
        const queryWords = query.split(/\s+/).filter(w => w.length > 3);
        let matches = 0;
        let totalWeight = 0;
        
        queryWords.forEach(word => {
            if (text.includes(word)) {
                matches++;
                // Give more weight to exact matches
                const count = (text.match(new RegExp(word, 'g')) || []).length;
                totalWeight += count;
            }
        });
        
        return (matches / queryWords.length) * (totalWeight / text.length) * 100;
    }

    // Get all document names
    getDocumentList() {
        return this.documents.map(doc => ({
            name: doc.name,
            type: doc.type,
            size: doc.content.length
        }));
    }
}

// ============================================
// INTEGRATION WITH CHATBOT
// ============================================

// Initialize the document loader
const docLoader = new DocumentLoader();

// Load documents when page loads
async function initializeDocumentLoader() {
    await docLoader.loadAllDocuments();
    console.log('📚 Document knowledge base ready!');
    console.log('Available documents:', docLoader.getDocumentList());
}

// Enhanced response function that uses document context
async function getAIResponseWithDocuments(userMessage) {
    // First, search the documents
    const relevantChunks = docLoader.search(userMessage, 3);
    
    // Build context from relevant chunks
    let context = '';
    if (relevantChunks.length > 0) {
        context = '\n\n**📚 Based on the following sources:**\n\n';
        relevantChunks.forEach((result, idx) => {
            context += `**${idx + 1}. From ${result.document}:**\n`;
            context += `${result.chunk}\n\n`;
        });
    }
    
    // Get the base AI response
    const baseResponse = await getAIResponseWithContext(userMessage);
    
    // If we found relevant documents, append the context
    if (context) {
        return baseResponse + context;
    }
    
    return baseResponse;
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDocumentLoader);
} else {
    initializeDocumentLoader();
}

console.log('📚 Document Loader System initialized');
