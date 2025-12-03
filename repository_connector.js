/**
 * ================================================================
 * CONECTOR DE REPOSITORIO ANTI-CHEAT
 * Stealth-AntiCheatX v3.0 - Conexión Automática al Repositorio
 * ================================================================
 */

const axios = require('./axios-wrapper.js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ======================
// CONFIGURACIÓN DE REPOSITORIO
// ======================

const REPOSITORY_CONFIG = {
    owner: 'xpe-hub',
    repo: 'stealth-bot-nuevo',
    branch: 'main',
    api_base: 'https://api.github.com',
    
    // Endpoints importantes
    endpoints: {
        commits: '/repos/{owner}/{repo}/commits',
        contents: '/repos/{owner}/{repo}/contents/{path}',
        branches: '/repos/{owner}/{repo}/branches',
        file_content: '/repos/{owner}/{repo}/contents/{path}?ref={branch}',
        search_code: '/search/code',
        search_commits: '/search/commits'
    },
    
    // Rutas de archivos importantes en el repositorio
    important_files: [
        'anticheat_patterns.json',
        'bypass_techniques.json',
        'threat_database.json',
        'config.json',
        'README.md',
        'CHANGELOG.md'
    ],
    
    // Patrones a monitorear
    monitor_patterns: [
        'cheat',
        'hack',
        'bypass',
        'inject',
        'exploit',
        'loader',
        'memory',
        'anticheat'
    ]
};

// ======================
// TOKEN DE ACCESO (DEBE CONFIGURARSE)
// ======================

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// ======================
// CLASE CONECTORA DEL REPOSITORIO
// ======================

class RepositoryConnector {
    constructor() {
        this.client = this.createGitHubClient();
        this.lastUpdate = null;
        this.cache = new Map();
        this.monitoredFiles = new Map();
        this.threatSignatures = new Map();
        
        this.initializeThreatSignatures();
    }

    /**
     * Crea cliente de GitHub
     */
    createGitHubClient() {
        const client = axios.create({
            baseURL: REPOSITORY_CONFIG.api_base,
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Stealth-AntiCheatX/3.0'
            },
            timeout: 30000
        });
        
        return client;
    }

    /**
     * Inicializa firmas de amenazas desde el repositorio
     */
    async initializeThreatSignatures() {
        try {
            console.log('🔍 Cargando firmas de amenazas desde repositorio...');
            
            // Intentar cargar base de datos de amenazas desde el repositorio
            const threatDbFile = await this.getFileContent('threat_database.json');
            if (threatDbFile) {
                const threatData = JSON.parse(atob(threatDbFile.content));
                for (const [key, value] of Object.entries(threatData)) {
                    this.threatSignatures.set(key, value);
                }
                console.log(`✅ ${this.threatSignatures.size} firmas cargadas`);
            } else {
                console.log('ℹ️ No se encontró archivo de amenazas, usando firmas locales');
            }
            
            // Cargar patrones de bypass
            const bypassFile = await this.getFileContent('bypass_techniques.json');
            if (bypassFile) {
                const bypassData = JSON.parse(atob(bypassFile.content));
                this.updateBypassTechniques(bypassData);
            }
            
        } catch (error) {
            console.warn('⚠️ Error cargando firmas desde repositorio:', error.message);
        }
    }

    /**
     * Obtiene contenido de un archivo del repositorio
     */
    async getFileContent(filePath, branch = REPOSITORY_CONFIG.branch) {
        try {
            const endpoint = REPOSITORY_CONFIG.endpoints.file_content
                .replace('{owner}', REPOSITORY_CONFIG.owner)
                .replace('{repo}', REPOSITORY_CONFIG.repo)
                .replace('{path}', filePath)
                .replace('{branch}', branch);
            
            const response = await this.client.get(endpoint);
            return response.data;
            
        } catch (error) {
            console.warn(`⚠️ No se pudo obtener ${filePath}:`, error.message);
            return null;
        }
    }

    /**
     * Lista commits recientes del repositorio
     */
    async getRecentCommits(limit = 10) {
        try {
            const endpoint = REPOSITORY_CONFIG.endpoints.commits
                .replace('{owner}', REPOSITORY_CONFIG.owner)
                .replace('{repo}', REPOSITORY_CONFIG.repo);
            
            const response = await this.client.get(endpoint, {
                params: { per_page: limit }
            });
            
            return response.data.map(commit => ({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                url: commit.html_url,
                files_changed: commit.files?.length || 0
            }));
            
        } catch (error) {
            console.error('Error obteniendo commits:', error.message);
            return [];
        }
    }

    /**
     * Busca patrones de amenazas en el código del repositorio
     */
    async searchThreatPatterns() {
        try {
            const patterns = [];
            
            for (const pattern of REPOSITORY_CONFIG.monitor_patterns) {
                const response = await this.client.get(REPOSITORY_CONFIG.endpoints.search_code, {
                    params: {
                        q: `${pattern} repo:${REPOSITORY_CONFIG.owner}/${REPOSITORY_CONFIG.repo}`,
                        sort: 'indexed',
                        order: 'desc'
                    }
                });
                
                if (response.data.items && response.data.items.length > 0) {
                    patterns.push({
                        pattern: pattern,
                        files_found: response.data.items.length,
                        results: response.data.items.slice(0, 5).map(item => ({
                            name: item.name,
                            path: item.path,
                            url: item.html_url,
                            score: item.score
                        }))
                    });
                }
            }
            
            return patterns;
            
        } catch (error) {
            console.error('Error buscando patrones:', error.message);
            return [];
        }
    }

    /**
     * Monitorea cambios importantes en archivos específicos
     */
    async monitorImportantFiles() {
        const results = [];
        
        for (const file of REPOSITORY_CONFIG.important_files) {
            try {
                const fileData = await this.getFileContent(file);
                if (fileData) {
                    const cacheKey = `${file}_${fileData.sha}`;
                    
                    if (!this.monitoredFiles.has(cacheKey)) {
                        // Archivo nuevo o modificado
                        this.monitoredFiles.set(cacheKey, {
                            file: file,
                            sha: fileData.sha,
                            last_modified: new Date(),
                            size: fileData.size
                        });
                        
                        results.push({
                            file: file,
                            status: 'updated',
                            sha: fileData.sha,
                            content: fileData.content ? atob(fileData.content) : null
                        });
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error monitoreando ${file}:`, error.message);
            }
        }
        
        return results;
    }

    /**
     * Obtiene estadísticas del repositorio
     */
    async getRepositoryStats() {
        try {
            const response = await this.client.get(`/repos/${REPOSITORY_CONFIG.owner}/${REPOSITORY_CONFIG.repo}`);
            const repo = response.data;
            
            return {
                name: repo.name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                last_update: repo.updated_at,
                default_branch: repo.default_branch,
                size_kb: repo.size,
                open_issues: repo.open_issues_count,
                subscribers: repo.subscribers_count
            };
            
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error.message);
            return null;
        }
    }

    /**
     * Descarga y analiza archivos importantes
     */
    async downloadAndAnalyzeImportantFiles() {
        const analyses = [];
        
        for (const file of REPOSITORY_CONFIG.important_files) {
            try {
                const fileData = await this.getFileContent(file);
                if (fileData && fileData.content) {
                    const content = atob(fileData.content);
                    
                    // Analizar contenido según tipo de archivo
                    let analysis = null;
                    
                    if (file.endsWith('.json')) {
                        try {
                            const jsonData = JSON.parse(content);
                            analysis = this.analyzeJsonStructure(jsonData, file);
                        } catch (jsonError) {
                            analysis = { error: 'Invalid JSON format', details: jsonError.message };
                        }
                    } else if (file.endsWith('.md')) {
                        analysis = this.analyzeMarkdownStructure(content, file);
                    }
                    
                    if (analysis) {
                        analyses.push({
                            file: file,
                            analysis: analysis,
                            download_time: new Date().toISOString(),
                            size: fileData.size
                        });
                    }
                }
            } catch (error) {
                console.warn(`⚠️ Error analizando ${file}:`, error.message);
            }
        }
        
        return analyses;
    }

    /**
     * Analiza estructura de archivos JSON
     */
    analyzeJsonStructure(data, filename) {
        const analysis = {
            filename: filename,
            type: 'json',
            structure: {},
            metrics: {},
            threats_detected: []
        };
        
        // Análisis de estructura
        if (typeof data === 'object') {
            analysis.structure = {
                keys_count: Object.keys(data).length,
                nested_levels: this.calculateNestingLevel(data),
                has_patterns: data.patterns ? true : false,
                has_signatures: data.signatures ? true : false
            };
        }
        
        // Detección de amenazas en datos
        if (data.patterns && Array.isArray(data.patterns)) {
            analysis.threats_detected.push({
                type: 'threat_patterns',
                count: data.patterns.length,
                examples: data.patterns.slice(0, 3)
            });
        }
        
        if (data.signatures && typeof data.signatures === 'object') {
            analysis.threats_detected.push({
                type: 'threat_signatures',
                count: Object.keys(data.signatures).length,
                categories: Object.keys(data.signatures)
            });
        }
        
        return analysis;
    }

    /**
     * Analiza estructura de archivos Markdown
     */
    analyzeMarkdownStructure(content, filename) {
        const analysis = {
            filename: filename,
            type: 'markdown',
            structure: {},
            metrics: {},
            threats_mentioned: []
        };
        
        const lines = content.split('\n');
        const headers = lines.filter(line => line.startsWith('#')).length;
        const threatMentions = [];
        
        // Buscar menciones de amenazas
        for (const pattern of REPOSITORY_CONFIG.monitor_patterns) {
            const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
            const matches = content.match(regex);
            if (matches && matches.length > 0) {
                threatMentions.push({
                    pattern: pattern,
                    count: matches.length
                });
            }
        }
        
        analysis.structure = {
            headers: headers,
            total_lines: lines.length,
            total_length: content.length
        };
        
        analysis.threats_mentioned = threatMentions;
        
        return analysis;
    }

    /**
     * Calcula nivel de anidación
     */
    calculateNestingLevel(obj, current = 0) {
        if (typeof obj !== 'object' || obj === null) {
            return current;
        }
        
        let maxLevel = current;
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const level = this.calculateNestingLevel(obj[key], current + 1);
                maxLevel = Math.max(maxLevel, level);
            }
        }
        
        return maxLevel;
    }

    /**
     * Actualiza técnicas de bypass
     */
    updateBypassTechniques(bypassData) {
        // Actualizar base de datos de técnicas de bypass
        console.log('🔧 Actualizando técnicas de bypass desde repositorio');
        
        // Aquí se podrían integrar las nuevas técnicas con el analizador
        // Por ejemplo, actualizar patrones de detección, etc.
    }

    /**
     * Obtiene informe completo del repositorio
     */
    async getRepositoryReport() {
        console.log('📊 Generando informe completo del repositorio...');
        
        const [
            commits,
            patterns,
            importantFiles,
            repoStats
        ] = await Promise.all([
            this.getRecentCommits(5),
            this.searchThreatPatterns(),
            this.monitorImportantFiles(),
            this.getRepositoryStats()
        ]);
        
        const report = {
            timestamp: new Date().toISOString(),
            repository: REPOSITORY_CONFIG.owner + '/' + REPOSITORY_CONFIG.repo,
            statistics: repoStats,
            recent_commits: commits,
            threat_patterns: patterns,
            monitored_files: importantFiles.map(f => ({
                file: f.file,
                status: f.status,
                last_modified: f.last_modified
            })),
            analyzer_stats: this.getAnalyzerStats(),
            recommendations: this.generateRecommendations(commits, patterns)
        };
        
        return report;
    }

    /**
     * Genera recomendaciones basadas en el análisis
     */
    generateRecommendations(commits, patterns) {
        const recommendations = [];
        
        // Recomendaciones basadas en commits recientes
        const recentCheatCommits = commits.filter(c => 
            REPOSITORY_CONFIG.monitor_patterns.some(p => 
                c.message.toLowerCase().includes(p)
            )
        );
        
        if (recentCheatCommits.length > 0) {
            recommendations.push({
                type: 'urgent',
                message: `${recentCheatCommits.length} commits relacionados con amenazas detectados`,
                action: 'Revisar inmediatamente los cambios'
            });
        }
        
        // Recomendaciones basadas en patrones encontrados
        const highRiskPatterns = patterns.filter(p => p.files_found > 5);
        if (highRiskPatterns.length > 0) {
            recommendations.push({
                type: 'monitoring',
                message: `${highRiskPatterns.length} patrones de alto riesgo detectados`,
                action: 'Aumentar frecuencia de monitoreo'
            });
        }
        
        if (recommendations.length === 0) {
            recommendations.push({
                type: 'info',
                message: 'Repositorio en estado normal',
                action: 'Continuar monitoreo automático'
            });
        }
        
        return recommendations;
    }

    /**
     * Obtiene estadísticas del analizador
     */
    getAnalyzerStats() {
        return {
            monitored_files: this.monitoredFiles.size,
            threat_signatures: this.threatSignatures.size,
            cache_size: this.cache.size,
            last_update: this.lastUpdate,
            repository: REPOSITORY_CONFIG.owner + '/' + REPOSITORY_CONFIG.repo
        };
    }

    /**
     * Fuerza actualización de datos del repositorio
     */
    async forceUpdate() {
        console.log('🔄 Forzando actualización del repositorio...');
        this.lastUpdate = new Date();
        
        try {
            const report = await this.getRepositoryReport();
            this.lastUpdate = new Date();
            
            console.log('✅ Actualización del repositorio completada');
            return report;
            
        } catch (error) {
            console.error('❌ Error en actualización forzada:', error);
            throw error;
        }
    }
}

// ======================
// FUNCIONES DE INTEGRACIÓN
// ======================

/**
 * Función principal para Discord - Obtiene informe del repositorio
 */
async function getRepositoryStatusForDiscord() {
    try {
        const connector = new RepositoryConnector();
        const report = await connector.getRepositoryReport();
        
        // Crear embed para Discord
        const embed = {
            color: 0x0099ff,
            title: '📡 Estado del Repositorio Anti-Cheat',
            description: `**Repositorio:** ${report.repository}\n**Última actualización:** <t:${Math.floor(new Date(report.timestamp).getTime() / 1000)}:R>`,
            fields: [],
            timestamp: report.timestamp,
            footer: { text: 'Stealth-AntiCheatX | Monitoreo Automático' }
        };
        
        // Campo de estadísticas
        if (report.statistics) {
            embed.fields.push({
                name: '📊 Estadísticas del Repositorio',
                value: `⭐ **Stars:** ${report.statistics.stars}\n🍴 **Forks:** ${report.statistics.forks}\n📝 **Issues:** ${report.statistics.open_issues}`,
                inline: true
            });
        }
        
        // Campo de commits recientes
        if (report.recent_commits.length > 0) {
            const commitsText = report.recent_commits
                .slice(0, 3)
                .map(c => `• \`${c.message.substring(0, 50)}...\` por ${c.author}`)
                .join('\n');
            
            embed.fields.push({
                name: `🔄 Commits Recientes (${report.recent_commits.length})`,
                value: commitsText,
                inline: true
            });
        }
        
        // Campo de patrones detectados
        if (report.threat_patterns.length > 0) {
            const patternsText = report.threat_patterns
                .slice(0, 3)
                .map(p => `• **${p.pattern}:** ${p.files_found} archivos`)
                .join('\n');
            
            embed.fields.push({
                name: `🔍 Patrones Detectados (${report.threat_patterns.length})`,
                value: patternsText,
                inline: false
            });
        }
        
        // Campo de recomendaciones
        if (report.recommendations.length > 0) {
            const recText = report.recommendations
                .slice(0, 2)
                .map(r => `• ${r.message}`)
                .join('\n');
            
            embed.fields.push({
                name: '💡 Recomendaciones',
                value: recText,
                inline: false
            });
        }
        
        return {
            success: true,
            embed: embed,
            detailed_report: report
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message,
            embed: {
                color: 0xff0000,
                title: '❌ Error de Conexión',
                description: `No se pudo conectar al repositorio: ${error.message}`,
                timestamp: new Date().toISOString()
            }
        };
    }
}

module.exports = {
    RepositoryConnector,
    getRepositoryStatusForDiscord,
    REPOSITORY_CONFIG
};