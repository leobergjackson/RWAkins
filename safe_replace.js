const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const replacements = {
  'NeuroCred': 'Credit Passport',
  'neuro cred': 'Credit Passport',
  'Legacy Vault': 'Family vault',
  'EternaVault': 'Family vault',
  'Agent Mesh': 'Agent co-ordinator',
  'TrustMesh': 'Agent co-ordinator',
  'CipherVault': 'Private vault',
  'SyncSplit': 'Bill split',
  'Lendora': 'Protocol Borrow Engine',
  'Treasury AI': 'Yield Operations Hub',
  'Treasury': 'Yield Operations Hub',
  'Shadow OS': 'Stealth Execution Suite'
};

const files = execSync('git ls-files hub/app hub/components', { encoding: 'utf-8' }).split('\n').filter(Boolean);

let modifiedCount = 0;

files.forEach(file => {
  const fullPath = path.resolve(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf-8');
  let originalContent = content;

  // We iterate over the text and carefully replace
  for (const [key, value] of Object.entries(replacements)) {
    // Escape regex for key
    const regexStr = key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    // We want to replace it only if it's not part of an import, export, tag name, path, or env var.
    // We use a regex with a replacement function.
    const regex = new RegExp(`(${regexStr})`, 'gi');
    
    content = content.replace(regex, (match, p1, offset, string) => {
      // Look at surrounding context
      const beforeContext = string.substring(Math.max(0, offset - 30), offset);
      const afterContext = string.substring(offset + match.length, Math.min(string.length, offset + match.length + 30));
      
      const isImportExport = /(import|export)\s+.*$/i.test(beforeContext) || /^\s+from/.test(afterContext);
      const isTag = /<$/.test(beforeContext) || /^>/.test(afterContext); // e.g. <Lendora or Lendora>
      const isEnvVar = /_$/.test(beforeContext) || /^_/.test(afterContext) || /NEXT_PUBLIC_/.test(beforeContext); // e.g. LENDORA_API
      const isPath = /\/$/.test(beforeContext) || /^\//.test(afterContext); // e.g. /lendora/
      const isFileExt = /^\./.test(afterContext); // e.g. Lendora.tsx
      const isClassName = /class[Nn]ame=["'].*$/i.test(beforeContext);
      const isComponentInstance = /<[A-Za-z0-9]*$/.test(beforeContext); // e.g. <TreasuryCard

      // specific skips based on the match
      if (match.toUpperCase() === key.toUpperCase() && match === match.toUpperCase() && key !== 'Shadow OS') {
        // e.g. LENDORA (all caps) -> usually part of env var or constant
        // But wait, if it's literally uppercase in UI, we might miss it. But it's safer to skip unless it's specifically 'Shadow OS' which has caps.
        if (isEnvVar) return match;
      }
      
      if (isImportExport || isTag || isEnvVar || isPath || isFileExt || isComponentInstance) {
        return match; // do not replace
      }

      // If it's a known exact match but we want to preserve case, we can just replace with the value, 
      // but let's just use the exact value the user asked for.
      return value;
    });
  }

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    modifiedCount++;
  }
});

console.log(`Modified ${modifiedCount} files safely.`);
