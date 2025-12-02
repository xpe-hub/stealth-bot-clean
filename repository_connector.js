/**
 * ========================================================
 * REPOSITORY CONNECTOR - STEALTH-ANTICHEATX v3.0
 * Conecta con repositorios GitHub para monitoreo automático
 * IMPORTANTE: Solo usa variables de entorno, no tokens hardcodeados
 * ========================================================
 */

// Solo usar variables de entorno - NUNCA tokens hardcodeados
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    console.log('⚠️ RepositoryConnector: GITHUB_TOKEN no configurado. Funciones de monitoreo deshabilitadas.');
}

/**
 * Clase para conectar y monitorear repositorios GitHub
 */
class RepositoryConnector {
    constructor() {
        this.token = GITHUB_TOKEN;
        this.baseUrl = 'https://api.github.com';
        
        if (this.token) {
            console.log('✅ RepositoryConnector: Configurado correctamente para monitoreo de repos');
        } else {
            console.log('❌ RepositoryConnector: Sin token, funciones limitadas');
        }
    }

    /**
     * Obtiene información de un repositorio específico
     */
    async getRepositoryInfo(owner, repo) {
        if (!this.token) {
            throw new Error('GITHUB_TOKEN requerido para acceso a repositorios');
        }

        try {
            const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error GitHub API: ${response.status}`);
            }

            const repoData = await response.json();
            return {
                name: repoData.name,
                description: repoData.description,
                url: repoData.html_url,
                language: repoData.language,
                stars: repoData.stargazers_count,
                lastUpdate: repoData.updated_at,
                defaultBranch: repoData.default_branch
            };
        } catch (error) {
            console.error('Error obteniendo info del repositorio:', error);
            throw error;
        }
    }

    /**
     * Obtiene commits recientes de un repositorio
     */
    async getRecentCommits(owner, repo, limit = 5) {
        if (!this.token) {
            throw new Error('GITHUB_TOKEN requerido para acceso a commits');
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=${limit}`, 
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Error GitHub API: ${response.status}`);
            }

            const commits = await response.json();
            return commits.map(commit => ({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                url: commit.html_url
            }));
        } catch (error) {
            console.error('Error obteniendo commits:', error);
            throw error;
        }
    }

    /**
     * Verifica si un repositorio tiene actualizaciones
     */
    async checkForUpdates(owner, repo) {
        try {
            const info = await this.getRepositoryInfo(owner, repo);
            const commits = await this.getRecentCommits(owner, repo, 1);
            
            return {
                hasUpdates: commits.length > 0,
                lastCommit: commits[0],
                repoInfo: info
            };
        } catch (error) {
            console.error('Error verificando actualizaciones:', error);
            return {
                hasUpdates: false,
                error: error.message
            };
        }
    }
}

/**
 * Instancia singleton del connector
 */
const repositoryConnector = new RepositoryConnector();

/**
 * Función para verificar repositorio del anticheat específicamente
 */
async function checkAntiCheatRepository() {
    try {
        // Configurar aquí el repositorio que quieres monitorear
        const ANTICHEAT_OWNER = 'stealth-mananger-ai'; // Cambiar por el owner real
        const ANTICHEAT_REPO = 'stealth-anticheatx';   // Cambiar por el repo real
        
        const result = await repositoryConnector.checkForUpdates(
            ANTICHEAT_OWNER, 
            ANTICHEAT_REPO
        );
        
        console.log('🔍 Verificación repositorio anticheat:', result.hasUpdates ? '✅ Actualizaciones disponibles' : 'ℹ️ Sin cambios recientes');
        return result;
    } catch (error) {
        console.error('❌ Error verificando repositorio anticheat:', error.message);
        return { hasUpdates: false, error: error.message };
    }
}

// Exportar funciones principales
module.exports = {
    RepositoryConnector,
    checkAntiCheatRepository,
    repositoryConnector
};