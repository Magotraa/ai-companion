# 📁 Data Folder Setup Guide

## Folder Structure

Create this folder structure in your portfolio root directory:

```
portfolio/
│
├── index.html
├── styles.css
├── script.js
│
├── data/                      # 👈 CREATE THIS FOLDER
│   ├── resume.txt             # Your CV in text format
│   ├── projects.json          # Projects in JSON format
│   ├── research.md            # Research papers in Markdown
│   ├── publications.json      # Publications metadata
│   ├── skills.txt             # Skills and expertise
│   └── additional-docs/       # Optional: subdirectory for more docs
│       ├── certificates.txt
│       └── awards.txt
│
└── README.md
```

## 📄 Document Formats Supported

### 1. Text Files (.txt)
Plain text format - easiest to use

**Example: data/resume.txt**
```
Dr. Arjun Magotra
Senior Gen AI Expert

EXPERIENCE:
- PWC Global Solutions (Aug 2025 - Present)
  Senior Gen AI Expert
  Led enterprise GenAI strategy...

- Deloitte USI (Dec 2023 - July 2025)
  Senior AI Consultant
  Managed GenAI-powered factory maintenance platform...
```

### 2. Markdown Files (.md)
Formatted text with headers

**Example: data/research.md**
```markdown
# Research Publications

## Neuromodulated Dopamine Plastic Networks
Published in Symmetry (2021)
SCIE-indexed journal

Focus: Heterogeneous Transfer Learning
Key Contributions:
- Novel neural plasticity approach
- Cross-domain transfer learning
...
```

### 3. JSON Files (.json)
Structured data format

**Example: data/projects.json**
```json
{
  "projects": [
    {
      "name": "GenAI Factory Maintenance Platform",
      "client": "Deloitte - MWC 2025",
      "description": "Multimodal AI system...",
      "technologies": ["LLaMA2/3", "Llava1.6", "DINOv2"],
      "achievements": [
        "Showcased at MWC 2025 Barcelona",
        "Real-time inference <100ms"
      ]
    }
  ]
}
```

## 🚀 Quick Setup

### Step 1: Create the data folder
```bash
# In your portfolio directory
mkdir data
```

### Step 2: Add your documents
Place your CV, project descriptions, research papers, etc. in the data folder.

### Step 3: Update your HTML
Add these scripts to your `index.html` BEFORE the closing `</body>` tag:

```html
<!-- Document Context System -->
<script src="chatbot-with-docs.js"></script>
<script src="document-loader.js"></script>

<!-- Your existing chatbot script -->
<script src="script.js"></script>
```

### Step 4: Test
1. Open your portfolio
2. Check browser console - you should see:
   ```
   📂 Loading documents from data folder...
   📄 Loaded: resume.txt
   📄 Loaded: projects.json
   ✅ Loaded 2 documents successfully
   📚 Document knowledge base ready!
   ```

## 📝 Creating Your Documents

### Easy Method: Export from Your PDFs

I'll create text versions of your CVs for you:

**data/resume.txt** - Copy from your CV
**data/projects.json** - Structured project data
**data/research.md** - Publication list
**data/skills.txt** - Technical skills

### Advanced Method: Use Your Existing PDFs

If you want to use PDFs directly:

1. Install PDF.js library:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
```

2. The chatbot will automatically parse PDFs (implementation included)

## 🎯 How It Works

1. **On Page Load:**
   - Chatbot automatically scans the `data/` folder
   - Loads all .txt, .md, and .json files
   - Chunks documents into searchable segments
   - Builds a searchable knowledge base

2. **When User Asks Question:**
   - Query is searched against all document chunks
   - Most relevant chunks are retrieved
   - AI generates response with citations
   - Sources are automatically referenced

3. **Example Interaction:**
   ```
   User: "Tell me about the MWC 2025 project"
   
   Bot: "Dr. Arjun led the GenAI Factory Maintenance Platform 
         showcased at MWC 2025 Barcelona...
         
         📚 Based on the following sources:
         
         1. From projects.json:
         GenAI Factory Maintenance Platform - Multimodal AI 
         system integrating LLaMA2/3, Llava1.6, and DINOv2..."
   ```

## 🔧 Configuration

### Customize Document Location

Edit `document-loader.js`:
```javascript
constructor() {
    this.dataFolder = './data/'; // Change this path
}
```

### Add More Document Types

Edit the `loadAllDocuments()` function:
```javascript
const documentsToLoad = [
    { name: 'resume.txt', type: 'txt' },
    { name: 'projects.json', type: 'json' },
    { name: 'custom-doc.md', type: 'md' },
    // Add your documents here
];
```

### Adjust Search Sensitivity

Edit the `search()` function:
```javascript
search(query, topK = 3) {  // Change topK for more/fewer results
    // ...
    if (score > 0.1) {  // Adjust threshold (0.0 to 1.0)
```

## 📊 Monitoring

Check browser console for:
- Document loading status
- Search queries and results
- Knowledge base statistics

```javascript
// Get document list
console.log(docLoader.getDocumentList());

// Test search
console.log(docLoader.search('machine learning', 5));
```

## 🛡️ Security Considerations

**Important:** The data folder is PUBLIC - anyone can access these files.

**Best Practices:**
- ✅ Only include public information
- ✅ Remove personal/sensitive data
- ✅ Don't include API keys or passwords
- ✅ Review each document before adding
- ❌ Don't store private documents here

## 🚨 Troubleshooting

### Documents Not Loading
```javascript
// Check console for errors
// Ensure files are in correct folder
// Check file permissions
```

### CORS Errors (Local Development)
Use a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

### Search Not Working
```javascript
// Verify documents loaded
console.log(docLoader.isLoaded);
console.log(docLoader.documents);
```

## 🎨 Example Use Cases

1. **Portfolio Context:**
   - User asks about specific project
   - Bot retrieves exact project details from projects.json
   - Provides accurate, sourced information

2. **Research Queries:**
   - User asks about publications
   - Bot searches through research.md
   - Lists papers with citations

3. **Skills Verification:**
   - User asks "Do you know React?"
   - Bot searches skills.txt
   - Provides confidence level with source

## 📈 Next Steps

1. Create the `data/` folder ✅
2. Add your documents ✅
3. Test document loading ✅
4. Customize search parameters ✅
5. Deploy with updated portfolio ✅

---

**Need Help?** Check the integration guide or browser console for detailed logs!