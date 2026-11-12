import fs from 'fs';
import path from 'path';
import { ANDROID_FILES } from '../src/androidProject/androidFiles';

const buildRoot = '/android-build';

console.log('Writing Android project files to', buildRoot);

// Ensure base directories
fs.mkdirSync(buildRoot, { recursive: true });

for (const file of ANDROID_FILES) {
  if (file.path === 'README.md') continue;
  const targetPath = path.join(buildRoot, file.path);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, file.content, 'utf-8');
  console.log('Wrote:', file.path);
}

// Add local.properties with sdk.dir
fs.writeFileSync(
  path.join(buildRoot, 'local.properties'),
  'sdk.dir=/opt/android-sdk\n',
  'utf-8'
);

// Add gradle.properties
fs.writeFileSync(
  path.join(buildRoot, 'gradle.properties'),
  `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`,
  'utf-8'
);

// Add strings.xml
const valuesDir = path.join(buildRoot, 'app/src/main/res/values');
fs.mkdirSync(valuesDir, { recursive: true });
fs.writeFileSync(
  path.join(valuesDir, 'strings.xml'),
  `<resources>
    <string name="app_name">DocScan Pro</string>
</resources>`,
  'utf-8'
);

// Add themes.xml
fs.writeFileSync(
  path.join(valuesDir, 'themes.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.DocScan" parent="android:Theme.Material.Light.NoActionBar" />
</resources>`,
  'utf-8'
);

console.log('Android project setup complete in /android-build');
