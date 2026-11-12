import test from 'node:test';
import assert from 'node:assert/strict';
import { ANDROID_FILES } from '../androidProject/androidFiles';

test('ANDROID_FILES contains all required deliverables', () => {
  const paths = ANDROID_FILES.map((f) => f.path);
  
  // Must contain build.gradle.kts (Module :app)
  assert.ok(paths.includes('app/build.gradle.kts'), 'Missing app/build.gradle.kts');
  
  // Must contain AndroidManifest.xml
  assert.ok(paths.includes('app/src/main/AndroidManifest.xml'), 'Missing AndroidManifest.xml');
  
  // Must contain file_paths.xml
  assert.ok(paths.includes('app/src/main/res/xml/file_paths.xml'), 'Missing file_paths.xml');
  
  // Must contain MainActivity.kt
  assert.ok(paths.includes('app/src/main/java/com/leandrocorrea/docscan/MainActivity.kt'), 'Missing MainActivity.kt');

  // Must contain README
  assert.ok(paths.includes('README.md'), 'Missing README.md');
});

test('ANDROID_FILES have no // TODO placeholders and credit Leandro Corrêa', () => {
  for (const file of ANDROID_FILES) {
    assert.ok(file.content.length > 50, `File ${file.path} is too short`);
    assert.ok(!file.content.includes('// TODO'), `File ${file.path} contains // TODO placeholder`);
  }

  const mainActivity = ANDROID_FILES.find((f) => f.path.endsWith('MainActivity.kt'));
  assert.ok(mainActivity?.content.includes('Leandro Corrêa'), 'MainActivity must credit Leandro Corrêa');

  const manifest = ANDROID_FILES.find((f) => f.path.endsWith('AndroidManifest.xml'));
  assert.ok(manifest?.content.includes('FileProvider'), 'Manifest must configure FileProvider');
  assert.ok(manifest?.content.includes('document_scanner'), 'Manifest must configure ML Kit dependency');

  const gradleApp = ANDROID_FILES.find((f) => f.path.endsWith('app/build.gradle.kts'));
  assert.ok(gradleApp?.content.includes('play-services-mlkit-document-scanner'), 'Gradle must include ML Kit Document Scanner dependency');
});
