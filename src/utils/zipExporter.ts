import JSZip from 'jszip';
import { ANDROID_FILES } from '../androidProject/androidFiles';

/**
 * Packs the complete Android Studio project into a downloadable .zip file
 * Developed by Leandro Corrêa
 */
export async function downloadAndroidProjectZip(
  projectName = 'DocScan-Android-LeandroCorrea'
): Promise<void> {
  const zip = new JSZip();

  // Root folder inside the zip
  const root = zip.folder(projectName);
  if (!root) return;

  for (const file of ANDROID_FILES) {
    root.file(file.path, file.content);
  }

  // Also include gitignore and gradle wrapper properties for convenient Android Studio opening
  root.file(
    '.gitignore',
    `*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
/.idea/navEditor.xml
/.idea/assetWizardSettings.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
local.properties
`
  );

  root.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
