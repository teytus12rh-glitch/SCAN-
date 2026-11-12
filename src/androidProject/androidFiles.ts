/**
 * Complete, production-grade Android Native Project Files
 * Kotlin + Jetpack Compose + Google ML Kit Document Scanner
 * Developed by Leandro Corrêa
 */

export interface AndroidProjectFile {
  path: string;
  name: string;
  category: 'gradle' | 'manifest' | 'kotlin' | 'res' | 'docs';
  description: string;
  content: string;
}

export const ANDROID_FILES: AndroidProjectFile[] = [
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (Module :app)',
    category: 'gradle',
    description: 'Configuração do módulo :app com todas as dependências do ML Kit, Compose, Material 3 e Coil.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.leandrocorrea.docscan"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.leandrocorrea.docscan"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // Configurar Keystore para release na Google Play
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX Core & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose & Material Design 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)

    // Google ML Kit Document Scanner (API Oficial Google Play Services)
    // Fornece detecção automática de bordas, correção de perspectiva, filtros P&B e exportação PDF/JPEG
    implementation("com.google.android.gms:play-services-mlkit-document-scanner:16.0.0-beta1")

    // Coil para carregamento assíncrono e cache eficiente de imagens no Compose
    implementation("io.coil-kt:coil-compose:2.7.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // Testes
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}
`
  },
  {
    path: 'gradle/libs.versions.toml',
    name: 'libs.versions.toml',
    category: 'gradle',
    description: 'Version Catalog oficial do Gradle (versões gerenciadas centralmente).',
    content: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.10.01"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'manifest',
    description: 'Manifesto configurado com FileProvider, download automático do modelo ML Kit e suporte ao Android 15+.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Permissões legadas apenas para Android 9 ou inferior (Android 10+ usa MediaStore sem permissões) -->
    <uses-permission
        android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="28"
        tools:ignore="ScopedStorage" />

    <application
        android:allowBackup="true"
        android:icon="@android:drawable/ic_menu_camera"
        android:label="DocScan Pro"
        android:roundIcon="@android:drawable/ic_menu_camera"
        android:supportsRtl="true"
        android:theme="@style/Theme.DocScan"
        tools:targetApi="35">

        <!-- Download automático do módulo ML Kit Document Scanner pelo Google Play Services na instalação -->
        <meta-data
            android:name="com.google.mlkit.vision.DEPENDENCIES"
            android:value="document_scanner" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.DocScan"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- FileProvider para compartilhamento seguro de PDFs e fotos via WhatsApp, E-mail e Drive -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>

</manifest>
`
  },
  {
    path: 'app/src/main/res/xml/file_paths.xml',
    name: 'res/xml/file_paths.xml',
    category: 'res',
    description: 'Mapeamento de diretórios privados do app acessíveis de forma segura via FileProvider.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Pasta interna permanente dos documentos escaneados -->
    <files-path
        name="scanned_documents"
        path="documents/" />

    <!-- Raiz da pasta interna privada do app -->
    <files-path
        name="internal_files"
        path="." />

    <!-- Cache para arquivos temporários antes do compartilhamento -->
    <cache-path
        name="cache_files"
        path="." />
</paths>
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/model/ScannedDocument.kt',
    name: 'ScannedDocument.kt',
    category: 'kotlin',
    description: 'Modelo de dados do documento escaneado (título, páginas, caminho do PDF e data).',
    content: `package com.leandrocorrea.docscan.model

import java.io.File

/**
 * Representa um documento escaneado no DocScan Pro.
 * Desenvolvido por Leandro Corrêa
 */
data class ScannedDocument(
    val id: String,
    val title: String,
    val createdAt: Long,
    val pageCount: Int,
    val pdfFilePath: String?,
    val pageImagePaths: List<String>,
    val fileSizeBytes: Long = 0L
) {
    /** Retorna a miniatura da primeira página para a lista */
    val thumbnailPath: String?
        get() = pageImagePaths.firstOrNull()

    /** Retorna o arquivo PDF como objeto File se existir */
    val pdfFile: File?
        get() = pdfFilePath?.let { File(it) }?.takeIf { it.exists() }

    /** Retorna lista de arquivos de imagem existentes */
    val pageFiles: List<File>
        get() = pageImagePaths.map { File(it) }.filter { it.exists() }
}
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/data/DocumentStorageManager.kt',
    name: 'DocumentStorageManager.kt',
    category: 'kotlin',
    description: 'Gerenciador de armazenamento 100% offline: copia os arquivos gerados pelo ML Kit para a pasta privada e persiste o índice local.',
    content: `package com.leandrocorrea.docscan.data

import android.content.Context
import android.net.Uri
import com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult
import com.leandrocorrea.docscan.model.ScannedDocument
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

/**
 * Gerenciador de Arquivos e Persistência Local 100% Offline.
 * Salva documentos na pasta privada do aplicativo (context.filesDir/documents)
 * e mantém um índice leve em JSON local (sem necessidade de banco pesado).
 *
 * Desenvolvido por Leandro Corrêa
 */
class DocumentStorageManager(private val context: Context) {

    private val documentsDir: File by lazy {
        File(context.filesDir, "documents").apply {
            if (!exists()) mkdirs()
        }
    }

    private val indexFile: File by lazy {
        File(context.filesDir, "documents_index.json")
    }

    /**
     * Processa o resultado do Google ML Kit Document Scanner:
     * Copia as imagens JPEG e o arquivo PDF da URI temporária do ML Kit
     * para a pasta privada permanente do aplicativo.
     */
    suspend fun saveScannedResult(
        result: GmsDocumentScanningResult,
        customTitle: String? = null
    ): ScannedDocument = withContext(Dispatchers.IO) {
        val docId = UUID.randomUUID().toString()
        val folder = File(documentsDir, docId).apply { mkdirs() }

        val timestamp = System.currentTimeMillis()
        val defaultTitle = customTitle?.takeIf { it.isNotBlank() } ?: run {
            val dateStr = SimpleDateFormat("dd-MM-yyyy_HH'h'mm", Locale.getDefault()).format(Date(timestamp))
            "Digitalização_$dateStr"
        }

        // 1. Copia as imagens de cada página escaneada
        val savedPagePaths = mutableListOf<String>()
        val pagesList = result.pages ?: emptyList()
        pagesList.forEachIndexed { index, page ->
            val pageUri = page.imageUri
            val targetFile = File(folder, "page_\${index + 1}.jpg")
            copyUriToFile(pageUri, targetFile)
            if (targetFile.exists()) {
                savedPagePaths.add(targetFile.absolutePath)
            }
        }

        // 2. Copia o arquivo PDF gerado pelo ML Kit
        var pdfPath: String? = null
        var totalSize = 0L
        result.pdf?.uri?.let { pdfUri ->
            val pdfFile = File(folder, "documento.pdf")
            copyUriToFile(pdfUri, pdfFile)
            if (pdfFile.exists()) {
                pdfPath = pdfFile.absolutePath
                totalSize = pdfFile.length()
            }
        }

        if (totalSize == 0L) {
            totalSize = savedPagePaths.sumOf { File(it).length() }
        }

        val newDoc = ScannedDocument(
            id = docId,
            title = defaultTitle,
            createdAt = timestamp,
            pageCount = savedPagePaths.size,
            pdfFilePath = pdfPath,
            pageImagePaths = savedPagePaths,
            fileSizeBytes = totalSize
        )

        // 3. Atualiza o índice local
        val allDocs = loadAllDocumentsInternal().toMutableList()
        allDocs.add(0, newDoc)
        saveIndexInternal(allDocs)

        newDoc
    }

    /**
     * Retorna todos os documentos salvos ordenados pelo mais recente
     */
    suspend fun getAllDocuments(): List<ScannedDocument> = withContext(Dispatchers.IO) {
        loadAllDocumentsInternal()
    }

    /**
     * Renomeia um documento existente
     */
    suspend fun renameDocument(id: String, newTitle: String): Boolean = withContext(Dispatchers.IO) {
        val allDocs = loadAllDocumentsInternal().toMutableList()
        val index = allDocs.indexOfFirst { it.id == id }
        if (index != -1) {
            allDocs[index] = allDocs[index].copy(title = newTitle.trim())
            saveIndexInternal(allDocs)
            true
        } else false
    }

    /**
     * Exclui um documento e todos os seus arquivos físicos
     */
    suspend fun deleteDocument(id: String): Boolean = withContext(Dispatchers.IO) {
        val allDocs = loadAllDocumentsInternal().toMutableList()
        val item = allDocs.firstOrNull { it.id == id } ?: return@withContext false

        // Exclui a pasta do documento
        val docFolder = File(documentsDir, id)
        if (docFolder.exists()) {
            docFolder.deleteRecursively()
        }

        allDocs.removeAll { it.id == id }
        saveIndexInternal(allDocs)
        true
    }

    private fun copyUriToFile(sourceUri: Uri, destinationFile: File) {
        var inputStream: InputStream? = null
        var outputStream: FileOutputStream? = null
        try {
            inputStream = context.contentResolver.openInputStream(sourceUri)
            outputStream = FileOutputStream(destinationFile)
            val buffer = ByteArray(8 * 1024)
            var bytesRead: Int
            while (inputStream?.read(buffer).also { bytesRead = it ?: -1 } != -1) {
                outputStream.write(buffer, 0, bytesRead)
            }
            outputStream.flush()
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            try { inputStream?.close() } catch (_: Exception) {}
            try { outputStream?.close() } catch (_: Exception) {}
        }
    }

    private fun loadAllDocumentsInternal(): List<ScannedDocument> {
        if (!indexFile.exists()) return emptyList()
        return try {
            val jsonStr = indexFile.readText()
            val jsonArray = JSONArray(jsonStr)
            val list = mutableListOf<ScannedDocument>()
            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                val pagesJson = obj.getJSONArray("pageImagePaths")
                val pages = mutableListOf<String>()
                for (j in 0 until pagesJson.length()) {
                    pages.add(pagesJson.getString(j))
                }

                val doc = ScannedDocument(
                    id = obj.getString("id"),
                    title = obj.getString("title"),
                    createdAt = obj.getLong("createdAt"),
                    pageCount = obj.getInt("pageCount"),
                    pdfFilePath = if (obj.has("pdfFilePath") && !obj.isNull("pdfFilePath")) obj.getString("pdfFilePath") else null,
                    pageImagePaths = pages,
                    fileSizeBytes = obj.optLong("fileSizeBytes", 0L)
                )

                // Verifica se os arquivos ainda existem fisicamente
                if (doc.pageFiles.isNotEmpty() || doc.pdfFile != null) {
                    list.add(doc)
                }
            }
            list.sortedByDescending { it.createdAt }
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    private fun saveIndexInternal(docs: List<ScannedDocument>) {
        try {
            val jsonArray = JSONArray()
            docs.forEach { doc ->
                val obj = JSONObject().apply {
                    put("id", doc.id)
                    put("title", doc.title)
                    put("createdAt", doc.createdAt)
                    put("pageCount", doc.pageCount)
                    put("pdfFilePath", doc.pdfFilePath)
                    put("fileSizeBytes", doc.fileSizeBytes)
                    val pagesJson = JSONArray()
                    doc.pageImagePaths.forEach { pagesJson.put(it) }
                    put("pageImagePaths", pagesJson)
                }
                jsonArray.put(obj)
            }
            indexFile.writeText(jsonArray.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/utils/MediaStoreExporter.kt',
    name: 'MediaStoreExporter.kt',
    category: 'kotlin',
    description: 'Exportação nativa para pasta pública Downloads / Pictures usando MediaStore (compatível com Android 10 a 15+ sem permissões antigas).',
    content: `package com.leandrocorrea.docscan.utils

import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import com.leandrocorrea.docscan.model.ScannedDocument
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileInputStream

/**
 * Utilitário moderno para salvar documentos no armazenamento público do celular.
 * Utiliza o Scoped Storage (MediaStore) do Android 10 (API 29) até o Android 15+ (API 35).
 * Não requer permissão perigosa WRITE_EXTERNAL_STORAGE nos Androids recentes.
 *
 * Desenvolvido por Leandro Corrêa
 */
object MediaStoreExporter {

    /**
     * Salva o arquivo PDF na pasta pública "Downloads" do celular
     */
    suspend fun savePdfToDownloads(context: Context, document: ScannedDocument): Uri? = withContext(Dispatchers.IO) {
        val pdfFile = document.pdfFile ?: return@withContext null
        val fileName = "\${sanitizeFileName(document.title)}.pdf"

        val values = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
            put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/DocScan")
                put(MediaStore.MediaColumns.IS_PENDING, 1)
            }
        }

        val collection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
        } else {
            MediaStore.Files.getContentUri("external")
        }

        val resolver = context.contentResolver
        val uri = resolver.insert(collection, values) ?: return@withContext null

        try {
            resolver.openOutputStream(uri)?.use { out ->
                FileInputStream(pdfFile).use { input ->
                    input.copyTo(out)
                }
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                values.clear()
                values.put(MediaStore.MediaColumns.IS_PENDING, 0)
                resolver.update(uri, values, null, null)
            }
            uri
        } catch (e: Exception) {
            e.printStackTrace()
            try { resolver.delete(uri, null, null) } catch (_: Exception) {}
            null
        }
    }

    /**
     * Salva todas as páginas como imagens JPEG na pasta pública "Pictures/DocScan"
     */
    suspend fun savePagesToPictures(context: Context, document: ScannedDocument): List<Uri> = withContext(Dispatchers.IO) {
        val savedUris = mutableListOf<Uri>()
        val pageFiles = document.pageFiles
        val baseName = sanitizeFileName(document.title)

        pageFiles.forEachIndexed { index, file ->
            val fileName = "\${baseName}_pag_\${index + 1}.jpg"
            val values = ContentValues().apply {
                put(MediaStore.Images.Media.DISPLAY_NAME, fileName)
                put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/DocScan")
                    put(MediaStore.Images.Media.IS_PENDING, 1)
                }
            }

            val collection = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
            } else {
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI
            }

            val resolver = context.contentResolver
            val uri = resolver.insert(collection, values)
            if (uri != null) {
                try {
                    resolver.openOutputStream(uri)?.use { out ->
                        FileInputStream(file).use { input ->
                            input.copyTo(out)
                        }
                    }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        values.clear()
                        values.put(MediaStore.Images.Media.IS_PENDING, 0)
                        resolver.update(uri, values, null, null)
                    }
                    savedUris.add(uri)
                } catch (e: Exception) {
                    e.printStackTrace()
                    try { resolver.delete(uri, null, null) } catch (_: Exception) {}
                }
            }
        }
        savedUris
    }

    private fun sanitizeFileName(name: String): String {
        return name.replace(Regex("[\\\\/:*?\\"<>|]"), "_").trim().ifEmpty { "Documento_Sem_Titulo" }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/utils/ShareHelper.kt',
    name: 'ShareHelper.kt',
    category: 'kotlin',
    description: 'Compartilhamento nativo via FileProvider + Intent.ACTION_SEND direto para WhatsApp, E-mail, Google Drive sem marca d\'água.',
    content: `package com.leandrocorrea.docscan.utils

import android.content.Context
import android.content.Intent
import androidx.core.content.FileProvider
import com.leandrocorrea.docscan.model.ScannedDocument
import java.io.File
import java.util.ArrayList

/**
 * Utilitário para compartilhamento nativo e seguro de arquivos no Android usando FileProvider.
 * Desenvolvido por Leandro Corrêa
 */
object ShareHelper {

    /**
     * Compartilha o arquivo PDF completo
     */
    fun sharePdf(context: Context, document: ScannedDocument) {
        val pdfFile = document.pdfFile ?: return
        val authority = "\${context.packageName}.fileprovider"

        val contentUri = FileProvider.getUriForFile(context, authority, pdfFile)

        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "application/pdf"
            putExtra(Intent.EXTRA_STREAM, contentUri)
            putExtra(Intent.EXTRA_SUBJECT, document.title)
            putExtra(Intent.EXTRA_TEXT, "\${document.title} (Digitalizado com DocScan Pro)")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }

        context.startActivity(Intent.createChooser(intent, "Compartilhar PDF via..."))
    }

    /**
     * Compartilha as imagens de todas as páginas (ou página única)
     */
    fun shareImages(context: Context, document: ScannedDocument) {
        val files = document.pageFiles
        if (files.isEmpty()) return

        val authority = "\${context.packageName}.fileprovider"

        if (files.size == 1) {
            val uri = FileProvider.getUriForFile(context, authority, files[0])
            val intent = Intent(Intent.ACTION_SEND).apply {
                type = "image/jpeg"
                putExtra(Intent.EXTRA_STREAM, uri)
                putExtra(Intent.EXTRA_SUBJECT, document.title)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            context.startActivity(Intent.createChooser(intent, "Compartilhar Imagem via..."))
        } else {
            val uriList = ArrayList(files.map { FileProvider.getUriForFile(context, authority, it) })
            val intent = Intent(Intent.ACTION_SEND_MULTIPLE).apply {
                type = "image/jpeg"
                putParcelableArrayListExtra(Intent.EXTRA_STREAM, uriList)
                putExtra(Intent.EXTRA_SUBJECT, document.title)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            context.startActivity(Intent.createChooser(intent, "Compartilhar Páginas via..."))
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/viewmodel/DocumentViewModel.kt',
    name: 'DocumentViewModel.kt',
    category: 'kotlin',
    description: 'ViewModel com StateFlow para busca reativa, carregamento assíncrono e gerenciamento de estado.',
    content: `package com.leandrocorrea.docscan.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult
import com.leandrocorrea.docscan.data.DocumentStorageManager
import com.leandrocorrea.docscan.model.ScannedDocument
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/**
 * ViewModel central da arquitetura MVVM do DocScan Pro.
 * Desenvolvido por Leandro Corrêa
 */
class DocumentViewModel(application: Application) : AndroidViewModel(application) {

    private val storageManager = DocumentStorageManager(application)

    private val _documents = MutableStateFlow<List<ScannedDocument>>(emptyList())
    val documents: StateFlow<List<ScannedDocument>> = _documents.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _selectedDocument = MutableStateFlow<ScannedDocument?>(null)
    val selectedDocument: StateFlow<ScannedDocument?> = _selectedDocument.asStateFlow()

    // Filtra documentos em tempo real conforme a digitação do usuário
    val filteredDocuments: StateFlow<List<ScannedDocument>> = combine(
        _documents,
        _searchQuery
    ) { docs, query ->
        if (query.isBlank()) {
            docs
        } else {
            val q = query.trim().lowercase()
            docs.filter { it.title.lowercase().contains(q) }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    init {
        loadDocuments()
    }

    fun loadDocuments() {
        viewModelScope.launch {
            _isLoading.value = true
            _documents.value = storageManager.getAllDocuments()
            _isLoading.value = false
        }
    }

    fun onSearchQueryChanged(newQuery: String) {
        _searchQuery.value = newQuery
    }

    fun selectDocument(document: ScannedDocument?) {
        _selectedDocument.value = document
    }

    /**
     * Chamado logo após o ML Kit Document Scanner finalizar o fluxo com sucesso
     */
    fun onScanCompleted(result: GmsDocumentScanningResult, onFinished: (ScannedDocument) -> Unit = {}) {
        viewModelScope.launch {
            _isLoading.value = true
            val savedDoc = storageManager.saveScannedResult(result)
            loadDocuments()
            _selectedDocument.value = savedDoc
            onFinished(savedDoc)
        }
    }

    fun renameDocument(id: String, newTitle: String) {
        viewModelScope.launch {
            if (storageManager.renameDocument(id, newTitle)) {
                loadDocuments()
                if (_selectedDocument.value?.id == id) {
                    _selectedDocument.value = _selectedDocument.value?.copy(title = newTitle.trim())
                }
            }
        }
    }

    fun deleteDocument(id: String, onDeleted: () -> Unit = {}) {
        viewModelScope.launch {
            if (storageManager.deleteDocument(id)) {
                if (_selectedDocument.value?.id == id) {
                    _selectedDocument.value = null
                }
                loadDocuments()
                onDeleted()
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/ui/components/AboutDialog.kt',
    name: 'AboutDialog.kt',
    category: 'kotlin',
    description: 'Diálogo "Sobre o App" elegante no Material Design 3 exibindo com destaque os créditos de Leandro Corrêa e características técnicas.',
    content: `package com.leandrocorrea.docscan.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DocumentScanner
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

/**
 * Diálogo Sobre o Aplicativo com créditos a Leandro Corrêa
 */
@Composable
fun AboutDialog(onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(
                onClick = onDismiss,
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Entendi")
            }
        },
        icon = {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.DocumentScanner,
                    contentDescription = null,
                    modifier = Modifier.size(36.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        },
        title = {
            Text(
                text = "DocScan Pro",
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        },
        text = {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Surface(
                    color = MaterialTheme.colorScheme.secondaryContainer,
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Desenvolvido por Leandro Corrêa",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSecondaryContainer
                        )
                    }
                }

                Text(
                    text = "Versão 1.0.0 • 100% Nativo Android",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp))

                Column(
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    FeatureBadge("100% Offline — Sem envio para servidores")
                    FeatureBadge("Sem Anúncios e Sem Marcas D'água")
                    FeatureBadge("Motor Oficial Google ML Kit Document Scanner")
                    FeatureBadge("Exportação em PDF Multipáginas e JPGs")
                    FeatureBadge("Filtros: Cor, P&B e Realce Mágico")
                }
            }
        },
        shape = RoundedCornerShape(24.dp)
    )
}

@Composable
private fun FeatureBadge(text: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = Icons.Default.CheckCircle,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/ui/screens/HomeScreen.kt',
    name: 'HomeScreen.kt',
    category: 'kotlin',
    description: 'Tela inicial com lista/grade de documentos escaneados, busca em tempo real, FAB "Escanear Documento" e créditos discretos.',
    content: `package com.leandrocorrea.docscan.ui.screens

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.leandrocorrea.docscan.model.ScannedDocument
import com.leandrocorrea.docscan.ui.components.AboutDialog
import com.leandrocorrea.docscan.utils.MediaStoreExporter
import com.leandrocorrea.docscan.utils.ShareHelper
import kotlinx.coroutines.launch
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Tela Inicial: Meus Documentos
 * Exibe lista ou grade com miniatura, título editável, data e páginas.
 *
 * Desenvolvido por Leandro Corrêa
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    documents: List<ScannedDocument>,
    searchQuery: String,
    onSearchQueryChanged: (String) -> Unit,
    onDocumentClick: (ScannedDocument) -> Unit,
    onScanClick: () -> Unit,
    onDeleteDocument: (String) -> Unit,
    onRenameDocument: (String, String) -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    var showAboutDialog by remember { mutableStateOf(false) }
    var documentToRename by remember { mutableStateOf<ScannedDocument?>(null) }
    var renameText by remember { mutableStateOf("") }
    var documentToDelete by remember { mutableStateOf<ScannedDocument?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "DocScan Pro",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Desenvolvido por Leandro Corrêa",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { showAboutDialog = true }) {
                        Icon(
                            imageVector = Icons.Outlined.Info,
                            contentDescription = "Sobre o App"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = onScanClick,
                icon = {
                    Icon(
                        imageVector = Icons.Default.DocumentScanner,
                        contentDescription = null
                    )
                },
                text = { Text("Escanear Documento", fontWeight = FontWeight.SemiBold) },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary,
                shape = RoundedCornerShape(16.dp)
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surfaceContainerLow,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "DocScan Pro • 100% Offline • Desenvolvido por Leandro Corrêa",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.outline,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 6.dp),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Barra de busca
            OutlinedTextField(
                value = searchQuery,
                onValueChange = onSearchQueryChanged,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                placeholder = { Text("Buscar documentos pelo nome...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Outlined.Search,
                        contentDescription = "Buscar"
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { onSearchQueryChanged("") }) {
                            Icon(imageVector = Icons.Default.Close, contentDescription = "Limpar busca")
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
                )
            )

            if (documents.isEmpty()) {
                // Estado Vazio
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Surface(
                            modifier = Modifier.size(96.dp),
                            shape = RoundedCornerShape(24.dp),
                            color = MaterialTheme.colorScheme.primaryContainer
                        ) {
                            Icon(
                                imageVector = Icons.Default.DocumentScanner,
                                contentDescription = null,
                                modifier = Modifier
                                    .padding(24.dp)
                                    .fillMaxSize(),
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = if (searchQuery.isBlank()) "Nenhum documento escaneado" else "Nenhum resultado encontrado",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (searchQuery.isBlank())
                                "Toque em 'Escanear Documento' para capturar com a câmera sem marcas d'água."
                            else
                                "Tente buscar com outro termo.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            } else {
                // Grade de Documentos (2 colunas)
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(documents, key = { it.id }) { doc ->
                        DocumentCard(
                            document = doc,
                            onClick = { onDocumentClick(doc) },
                            onShare = { ShareHelper.sharePdf(context, doc) },
                            onSave = {
                                coroutineScope.launch {
                                    val uri = MediaStoreExporter.savePdfToDownloads(context, doc)
                                    if (uri != null) {
                                        snackbarHostState.showSnackbar("PDF salvo na pasta Downloads/DocScan!")
                                    } else {
                                        snackbarHostState.showSnackbar("Erro ao salvar arquivo.")
                                    }
                                }
                            },
                            onRename = {
                                documentToRename = doc
                                renameText = doc.title
                            },
                            onDelete = {
                                documentToDelete = doc
                            }
                        )
                    }
                }
            }
        }
    }

    // Diálogo Sobre o App
    if (showAboutDialog) {
        AboutDialog(onDismiss = { showAboutDialog = false })
    }

    // Diálogo Renomear
    documentToRename?.let { doc ->
        AlertDialog(
            onDismissRequest = { documentToRename = null },
            title = { Text("Renomear Documento") },
            text = {
                OutlinedTextField(
                    value = renameText,
                    onValueChange = { renameText = it },
                    singleLine = true,
                    label = { Text("Novo nome") },
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (renameText.isNotBlank()) {
                            onRenameDocument(doc.id, renameText)
                        }
                        documentToRename = null
                    }
                ) {
                    Text("Salvar")
                }
            },
            dismissButton = {
                TextButton(onClick = { documentToRename = null }) {
                    Text("Cancelar")
                }
            }
        )
    }

    // Diálogo Confirmar Exclusão
    documentToDelete?.let { doc ->
        AlertDialog(
            onDismissRequest = { documentToDelete = null },
            icon = { Icon(Icons.Default.Delete, contentDescription = null, tint = MaterialTheme.colorScheme.error) },
            title = { Text("Excluir Documento?") },
            text = { Text("O documento '\${doc.title}' e todas as suas páginas serão removidos permanentemente do celular.") },
            confirmButton = {
                Button(
                    onClick = {
                        onDeleteDocument(doc.id)
                        documentToDelete = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Excluir")
                }
            },
            dismissButton = {
                TextButton(onClick = { documentToDelete = null }) {
                    Text("Cancelar")
                }
            }
        )
    }
}

/**
 * Card individual de documento escaneado com miniatura real
 */
@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun DocumentCard(
    document: ScannedDocument,
    onClick: () -> Unit,
    onShare: () -> Unit,
    onSave: () -> Unit,
    onRename: () -> Unit,
    onDelete: () -> Unit
) {
    var menuExpanded by remember { mutableStateOf(false) }
    val formattedDate = remember(document.createdAt) {
        SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault()).format(Date(document.createdAt))
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .combinedClickable(
                onClick = onClick,
                onLongClick = { menuExpanded = true }
            ),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceContainer)
    ) {
        Column {
            // Miniatura
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(160.dp)
                    .background(MaterialTheme.colorScheme.surfaceContainerHighest)
            ) {
                if (document.thumbnailPath != null && File(document.thumbnailPath!!).exists()) {
                    AsyncImage(
                        model = ImageRequest.Builder(LocalContext.current)
                            .data(File(document.thumbnailPath!!))
                            .crossfade(true)
                            .build(),
                        contentDescription = document.title,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.PictureAsPdf,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }

                // Badge de Páginas
                Surface(
                    color = MaterialTheme.colorScheme.surface.copy(alpha = 0.85f),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(8.dp)
                ) {
                    Text(
                        text = "\${document.pageCount} \${if (document.pageCount == 1) "pág" else "págs"}",
                        style = MaterialTheme.typography.labelSmall,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            // Informações e Menu
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = document.title,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = formattedDate,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Box {
                    IconButton(
                        onClick = { menuExpanded = true },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(Icons.Default.MoreVert, contentDescription = "Mais opções", modifier = Modifier.size(18.dp))
                    }

                    DropdownMenu(
                        expanded = menuExpanded,
                        onDismissRequest = { menuExpanded = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Compartilhar PDF") },
                            leadingIcon = { Icon(Icons.Default.Share, contentDescription = null) },
                            onClick = {
                                menuExpanded = false
                                onShare()
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Salvar no Celular") },
                            leadingIcon = { Icon(Icons.Default.Download, contentDescription = null) },
                            onClick = {
                                menuExpanded = false
                                onSave()
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Renomear") },
                            leadingIcon = { Icon(Icons.Default.Edit, contentDescription = null) },
                            onClick = {
                                menuExpanded = false
                                onRename()
                            }
                        )
                        HorizontalDivider()
                        DropdownMenuItem(
                            text = { Text("Excluir", color = MaterialTheme.colorScheme.error) },
                            leadingIcon = { Icon(Icons.Default.Delete, contentDescription = null, tint = MaterialTheme.colorScheme.error) },
                            onClick = {
                                menuExpanded = false
                                onDelete()
                            }
                        )
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/ui/screens/ViewerScreen.kt',
    name: 'ViewerScreen.kt',
    category: 'kotlin',
    description: 'Tela de visualização de documento: folhear páginas em tela cheia com HorizontalPager, zoom, renomear, compartilhar e exportar.',
    content: `package com.leandrocorrea.docscan.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.leandrocorrea.docscan.model.ScannedDocument
import com.leandrocorrea.docscan.utils.MediaStoreExporter
import com.leandrocorrea.docscan.utils.ShareHelper
import kotlinx.coroutines.launch
import java.io.File

/**
 * Visualizador de Documento Salvo
 * Permite folhear as páginas escaneadas, renomear, compartilhar e salvar no celular.
 *
 * Desenvolvido por Leandro Corrêa
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ViewerScreen(
    document: ScannedDocument,
    onBackClick: () -> Unit,
    onDeleteClick: () -> Unit,
    onRenameClick: (String) -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    val pageFiles = remember(document) { document.pageFiles }
    val pagerState = rememberPagerState(pageCount = { maxOf(1, pageFiles.size) })

    var showRenameDialog by remember { mutableStateOf(false) }
    var renameText by remember { mutableStateOf(document.title) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = document.title,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1
                        )
                        Text(
                            text = "Página \${pagerState.currentPage + 1} de \${pageFiles.size}",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Voltar")
                    }
                },
                actions = {
                    IconButton(onClick = {
                        renameText = document.title
                        showRenameDialog = true
                    }) {
                        Icon(imageVector = Icons.Default.Edit, contentDescription = "Renomear")
                    }
                    IconButton(onClick = onDeleteClick) {
                        Icon(imageVector = Icons.Default.Delete, contentDescription = "Excluir", tint = MaterialTheme.colorScheme.error)
                    }
                }
            )
        },
        bottomBar = {
            Surface(
                tonalElevation = 4.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Botão Salvar no Celular (MediaStore)
                    OutlinedButton(
                        onClick = {
                            coroutineScope.launch {
                                val uri = MediaStoreExporter.savePdfToDownloads(context, document)
                                if (uri != null) {
                                    snackbarHostState.showSnackbar("PDF salvo com sucesso em Downloads/DocScan!")
                                } else {
                                    snackbarHostState.showSnackbar("Erro ao salvar PDF.")
                                }
                            }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Salvar no Celular")
                    }

                    // Botão Compartilhar (FileProvider)
                    Button(
                        onClick = { ShareHelper.sharePdf(context, document) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Compartilhar")
                    }
                }
            }
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.surfaceContainerLowest),
            contentAlignment = Alignment.Center
        ) {
            if (pageFiles.isEmpty()) {
                Text("Nenhuma página disponível para este documento.")
            } else {
                HorizontalPager(
                    state = pagerState,
                    modifier = Modifier.fillMaxSize()
                ) { pageIndex ->
                    val file = pageFiles[pageIndex]
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            AsyncImage(
                                model = ImageRequest.Builder(context)
                                    .data(file)
                                    .crossfade(true)
                                    .build(),
                                contentDescription = "Página \${pageIndex + 1}",
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .wrapContentHeight(),
                                contentScale = ContentScale.Fit
                            )
                        }
                    }
                }
            }
        }
    }

    if (showRenameDialog) {
        AlertDialog(
            onDismissRequest = { showRenameDialog = false },
            title = { Text("Renomear Documento") },
            text = {
                OutlinedTextField(
                    value = renameText,
                    onValueChange = { renameText = it },
                    singleLine = true,
                    label = { Text("Nome do Documento") },
                    modifier = Modifier.fillMaxWidth()
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (renameText.isNotBlank()) {
                            onRenameClick(renameText)
                        }
                        showRenameDialog = false
                    }
                ) {
                    Text("Salvar")
                }
            },
            dismissButton = {
                TextButton(onClick = { showRenameDialog = false }) {
                    Text("Cancelar")
                }
            }
        )
    }
}
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/ui/theme/Color.kt',
    name: 'Color.kt',
    category: 'kotlin',
    description: 'Paleta Material Design 3 inspirada no CamScanner Pro com tons esmeralda e ardósia.',
    content: `package com.leandrocorrea.docscan.ui.theme

import androidx.compose.ui.graphics.Color

// Paleta Primária CamScanner Emerald
val Emerald80 = Color(0xFF66DDAA)
val EmeraldGrey80 = Color(0xFFB0CCC0)
val Mint80 = Color(0xFF98E4D6)

val Emerald40 = Color(0xFF0F766E)
val EmeraldGrey40 = Color(0xFF334E45)
val Mint40 = Color(0xFF005047)

val DarkBackground = Color(0xFF111827)
val DarkSurface = Color(0xFF1F2937)
val LightBackground = Color(0xFFF9FAFB)
val LightSurface = Color(0xFFFFFFFF)
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/ui/theme/Theme.kt',
    name: 'Theme.kt',
    category: 'kotlin',
    description: 'Configuração do MaterialTheme com suporte a Tema Claro e Tema Escuro automático.',
    content: `package com.leandrocorrea.docscan.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = Emerald80,
    secondary = Mint80,
    tertiary = EmeraldGrey80
)

private val LightColorScheme = lightColorScheme(
    primary = Emerald40,
    secondary = Mint40,
    tertiary = EmeraldGrey40
)

@Composable
fun DocScanTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
`
  },
  {
    path: 'app/src/main/java/com/leandrocorrea/docscan/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'kotlin',
    description: 'Activity principal: integração oficial com Google ML Kit Document Scanner (GmsDocumentScanning.getClient) e navegação Compose.',
    content: `package com.leandrocorrea.docscan

import android.app.Activity
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions.*
import com.google.mlkit.vision.documentscanner.GmsDocumentScanning
import com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult
import com.leandrocorrea.docscan.ui.screens.HomeScreen
import com.leandrocorrea.docscan.ui.screens.ViewerScreen
import com.leandrocorrea.docscan.ui.theme.DocScanTheme
import com.leandrocorrea.docscan.viewmodel.DocumentViewModel

/**
 * MainActivity do DocScan Pro
 * Integração completa com Google ML Kit Document Scanner API
 * 100% Offline • Sem anúncios • Sem marcas d'água
 *
 * Desenvolvido por Leandro Corrêa
 */
class MainActivity : ComponentActivity() {

    private val viewModel: DocumentViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            DocScanTheme {
                DocScanApp(
                    activity = this,
                    viewModel = viewModel
                )
            }
        }
    }
}

@Composable
fun DocScanApp(
    activity: ComponentActivity,
    viewModel: DocumentViewModel
) {
    val documents by viewModel.filteredDocuments.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedDoc by viewModel.selectedDocument.collectAsState()

    // 1. Registro do Launcher Oficial para o ML Kit Document Scanner
    val scannerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartIntentSenderForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val scanningResult = GmsDocumentScanningResult.fromActivityResultIntent(result.data)
            if (scanningResult != null) {
                viewModel.onScanCompleted(scanningResult) { newDoc ->
                    Toast.makeText(
                        activity,
                        "Documento salvo com sucesso! (\${newDoc.pageCount} páginas)",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }

    // 2. Função para disparar o fluxo nativo do Google ML Kit Document Scanner
    val startScanner: () -> Unit = {
        // Configurações completas do scanner (equivalente ao CamScanner Pro)
        val options = GmsDocumentScannerOptions.Builder()
            .setGalleryImportAllowed(true) // Permite importar fotos da galeria
            .setPageLimit(100) // Limite de até 100 páginas por documento
            .setResultFormats(RESULT_FORMAT_JPEG, RESULT_FORMAT_PDF) // Gera tanto JPEG quanto PDF
            .setScannerMode(SCANNER_MODE_FULL) // Habilita detecção automática de bordas, rotação e filtros de limpeza
            .build()

        val scanner = GmsDocumentScanning.getClient(options)
        scanner.getStartScanIntent(activity)
            .addOnSuccessListener { intentSender ->
                val request = IntentSenderRequest.Builder(intentSender).build()
                scannerLauncher.launch(request)
            }
            .addOnFailureListener { exception ->
                Toast.makeText(
                    activity,
                    "Falha ao iniciar o scanner: \${exception.localizedMessage}",
                    Toast.LENGTH_LONG
                ).show()
            }
    }

    Surface(modifier = Modifier.fillMaxSize()) {
        AnimatedContent(
            targetState = selectedDoc,
            transitionSpec = { fadeIn() togetherWith fadeOut() },
            label = "ScreenTransition"
        ) { doc ->
            if (doc != null) {
                // Tela de Visualização do Documento
                ViewerScreen(
                    document = doc,
                    onBackClick = { viewModel.selectDocument(null) },
                    onDeleteClick = {
                        viewModel.deleteDocument(doc.id) {
                            Toast.makeText(activity, "Documento excluído", Toast.LENGTH_SHORT).show()
                        }
                    },
                    onRenameClick = { newName ->
                        viewModel.renameDocument(doc.id, newName)
                    }
                )
            } else {
                // Tela Inicial (Lista/Grade de Documentos)
                HomeScreen(
                    documents = documents,
                    searchQuery = searchQuery,
                    onSearchQueryChanged = { viewModel.onSearchQueryChanged(it) },
                    onDocumentClick = { viewModel.selectDocument(it) },
                    onScanClick = startScanner,
                    onDeleteDocument = { id -> viewModel.deleteDocument(id) },
                    onRenameDocument = { id, newName -> viewModel.renameDocument(id, newName) }
                )
            }
        }
    }
}
`
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts (Project)',
    category: 'gradle',
    description: 'Gradle no nível do projeto com plugins Android e Kotlin.',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'gradle',
    description: 'Configuração de repositórios oficiais (google, mavenCentral).',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "DocScan"
include(":app")
`
  },
  {
    path: 'README.md',
    name: 'README.md (Instruções de Compilação)',
    category: 'docs',
    description: 'Guia passo a passo completo para abrir no Android Studio e gerar o APK.',
    content: `# DocScan Pro — CamScanner Android Nativo

Aplicativo Android nativo completo, leve, 100% offline, sem anúncios e sem marcas d'água.
**Desenvolvido por Leandro Corrêa**

---

## 🛠️ Stack Tecnológica
- **Linguagem:** Kotlin 2.0+
- **Interface:** Jetpack Compose com Material Design 3 (Material You dinâmico)
- **Motor de Scanner:** \`com.google.android.gms:play-services-mlkit-document-scanner:16.0.0-beta1\`
- **Armazenamento:** Arquitetura Scoped Storage (pasta privada \`context.filesDir\` + \`MediaStore\` para Downloads públicos)
- **Compartilhamento:** \`FileProvider\` seguro com \`Intent.ACTION_SEND\`

---

## 🚀 Como Criar e Compilar no Android Studio

### Passo 1: Criar o Projeto
1. Abra o **Android Studio** (versão Ladybug, Koala, Jellyfish ou Hedgehog).
2. Clique em **New Project** > selecione **Empty Activity** (a que possui o logo do Compose).
3. Preencha as configurações:
   - **Name:** \`DocScan\`
   - **Package name:** \`com.leandrocorrea.docscan\`
   - **Save location:** escolha uma pasta no seu computador
   - **Language:** \`Kotlin\`
   - **Minimum SDK:** \`API 24 ("Nougat")\`
   - **Build configuration language:** \`Kotlin DSL (build.gradle.kts)\`
4. Clique em **Finish**.

### Passo 2: Copiar os Arquivos
Substitua ou crie os arquivos conforme a estrutura do projeto:
- Substitua \`app/build.gradle.kts\`
- Substitua \`gradle/libs.versions.toml\`
- Substitua \`app/src/main/AndroidManifest.xml\`
- Crie a pasta \`app/src/main/res/xml/\` e adicione \`file_paths.xml\`
- Cole os arquivos Kotlin dentro do pacote \`com/leandrocorrea/docscan/\`:
  - \`MainActivity.kt\`
  - \`model/ScannedDocument.kt\`
  - \`data/DocumentStorageManager.kt\`
  - \`viewmodel/DocumentViewModel.kt\`
  - \`utils/MediaStoreExporter.kt\`
  - \`utils/ShareHelper.kt\`
  - \`ui/screens/HomeScreen.kt\`
  - \`ui/screens/ViewerScreen.kt\`
  - \`ui/components/AboutDialog.kt\`
  - \`ui/theme/Color.kt\`
  - \`ui/theme/Theme.kt\`

### Passo 3: Sincronizar o Gradle
Clique no ícone de elefante com a seta azul no topo direito:
👉 **Sync Project with Gradle Files**

---

## 📱 Como Gerar o Arquivo .APK

### Opção A: Gerar Debug APK (Uso Imediato no Celular)
1. No menu superior do Android Studio, clique em:
   **Build > Build APK(s)** (ou **Build > Build Bundle(s) / APK(s) > Build APK(s)**).
2. Aguarde a barra de progresso inferior finalizar a compilação.
3. No canto inferior direito aparecerá a notificação:
   *"APK(s) generated successfully for module 'app'"*.
4. Clique em **locate** para abrir a pasta onde o arquivo \`app-debug.apk\` foi gerado:
   \`app/build/outputs/apk/debug/app-debug.apk\`
5. Basta enviar este arquivo pelo WhatsApp, Telegram ou cabo USB para qualquer celular Android e clicar para instalar!

### Opção B: Gerar Release APK Assinado (Para Produção / Play Store)
1. No menu superior, clique em:
   **Build > Generate Signed Bundle / APK...**
2. Escolha **APK** e clique em **Next**.
3. Em **Key store path**, selecione sua chave existente ou clique em **Create new...** para criar uma nova chave de assinatura (.jks).
4. Digite a senha da chave e do keystore.
5. Selecione a variante **release**.
6. Marque a assinatura **V2 (Full APK Signature)**.
7. Clique em **Create**.
8. O APK otimizado e assinado estará na pasta:
   \`app/release/app-release.apk\`

---

## 🌟 Recursos Exclusivos do DocScan Pro
- **Zero Marcas D'água:** Seus PDFs e JPGs saem 100% limpos e profissionais.
- **Detecção Inteligente:** O visor do Google ML Kit encontra as bordas da folha e corrige a perspectiva em tempo real.
- **Filtros Automáticos:** Remove sombras indesejadas, clareia folhas amareladas e converte para preto e branco nítido.
- **100% Offline:** Seus documentos nunca saem do seu aparelho. Privacidade absoluta.
`
  }
];
