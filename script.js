// Example of previously registered startup ideas
const registeredIdeas = [
    "Online marketplace for handmade goods",
    "Subscription box for gourmet snacks",
    "AI-powered personal fitness trainer",
    "Peer-to-peer car rental service",
    "Mobile app for language learning",
    "Blockchain-based voting system"
];
const registeredIdeasdes = [
    "Online marketplace for handmade goods for assan walan no yaalan falaan indidu indok indogi dic"
    
];

let dictionary = new Map();
dictionary.set(1, "word");
dictionary.set(2, "value");

document.getElementById('startup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const startupIdea = document.getElementById('startup-idea').value.trim();
    const startupIdeades = document.getElementById('startup-ideades').value.trim();
    const resultDiv = document.getElementById('idea-result');
    const fileInput = document.getElementById("panFile");
    const file = fileInput.files[0];
   

    const uniqueness = calculateUniqueness(startupIdea,registeredIdeas);
    const uniquenessdes = calculateUniqueness(startupIdeades,registeredIdeasdes);
    const unique = (uniqueness + uniquenessdes)/2;

    if (file) {
        const fileType = file.type;

        if (fileType === "application/pdf") {
            processPdf(file);
        } else if (fileType.startsWith("image/")) {
            processImage(file);
        } else {
            alert("Please upload a valid PDF or image file.");
        }
    } else {
        alert("No file selected.");
    }

    resultDiv.innerHTML = `Your idea is ${unique}% unique compared to existing ideas.`;
});



function calculateUniqueness(idea,registeredIdeas) {
    let highestSimilarity = 0;
    
    registeredIdeas.forEach(registeredIdea => {
        const similarity = compareStrings(idea, registeredIdea);
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
        }
    });

    // Uniqueness is the inverse of similarity percentage
    return Math.round((1 - highestSimilarity) * 100);
}

function compareStrings(str1, str2) {
    // A simple comparison algorithm using Jaccard similarity coefficient
    const set1 = new Set(str1.toLowerCase().split(' '));
    const set2 = new Set(str2.toLowerCase().split(' '));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
}
function processPdf(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const typedArray = new Uint8Array(event.target.result);

        // Initialize PDF.js and load the document
        pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
            let numPages = pdf.numPages;
            let pageTextPromises = [];

            // Extract text from all pages of the PDF
            for (let i = 1; i <= numPages; i++) {
                pageTextPromises.push(pdf.getPage(i).then(function(page) {
                    return page.getTextContent().then(function(textContent) {
                        return textContent.items.map(item => item.str).join(' ');
                    });
                }));
            }

            // After extracting all the text
            Promise.all(pageTextPromises).then(function(pagesText) {
                const fullText = pagesText.join(' ');
                validatePan(fullText);
            });
        });
    };
    reader.readAsArrayBuffer(file);
}

// Function to process image files using Tesseract.js
function processImage(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        Tesseract.recognize(
            event.target.result,
            'eng',
            {
                logger: function(m) {
                    console.log(m); // Logs progress
                }
            }
        ).then(({ data: { text } }) => {
            validatePan(text);
        });
    };
    reader.readAsDataURL(file);
}

// PAN Validation Function using Regular Expression
function validatePan(text) {
    const panRegex = /[A-Z]{5}\d{4}[A-Z]{1}/; // Regex to match PAN format (5 letters, 4 digits, 1 letter)
    const outputDiv = document.getElementById("doc-result");

    if (panRegex.test(text)) {
        outputDiv.innerHTML = "<p style='color: green;'>Valid PAN card detected.</p>";
    } else {
        outputDiv.innerHTML = "<p style='color: red;'>Invalid PAN card. Please check the document.</p>";
    }
}