const fs = require('fs');
const { minify } = require('terser');

async function minifyFiles() {
    // Specify your input files
    const inputFiles = [
        'path/to/your/file1.js',
        'path/to/your/file2.js',
        // Add more files as needed
    ];

    // Read each file and minify it
    for (const file of inputFiles) {
        const code = fs.readFileSync(file, 'utf8');
        const result = await minify(code);

        // Write the minified code to a new file
        const outputFileName = file.replace('.js', '.min.js');
        fs.writeFileSync(outputFileName, result.code);
        console.log(`Minified: ${outputFileName}`);
    }
}

minifyFiles().catch(console.error);
