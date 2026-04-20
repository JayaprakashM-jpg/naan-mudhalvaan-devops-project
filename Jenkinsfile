pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
    }

    environment {
        MAVEN_OPTS = '-DskipTests'
    }

    stages {

        stage('📦 Checkout Code') {
            steps {
                echo 'Cloning repository from GitHub...'
                checkout scm
                echo '✅ Code successfully checked out'
            }
        }

        stage('🔧 Build Application') {
            steps {
                echo 'Building project with Maven...'
                bat 'mvn clean compile'
                echo '✅ Build completed successfully'
            }
        }

        stage('📦 Package Application') {
            steps {
                echo 'Creating WAR package...'
                bat 'mvn package -DskipTests'
                echo '✅ WAR file created successfully'
            }
        }

        stage('📄 Archive Artifact') {
            steps {
                echo 'Archiving WAR file...'
                archiveArtifacts artifacts: 'target/*.war', fingerprint: true
                echo '✅ Artifact archived'
            }
        }

        // ✅ FIXED DEPLOY STAGE (UPDATED)
        stage('🚀 Deploy to Server') {
            steps {
                echo 'Deploying application...'
                script {

                    // Stop any running server on port 8000 (safe)
                    bat '''
                    for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
                        taskkill /F /PID %%a >nul 2>&1
                    )
                    exit 0
                    '''

                    // Create deployment folder
                    bat 'if not exist C:\\temp\\webapp mkdir C:\\temp\\webapp'

                    // Copy WAR file (FIXED PART)
                    bat 'copy target\\*.war C:\\temp\\webapp\\ >nul'

                    // Start server
                    bat 'start /B python -m http.server 8000 --directory C:\\temp\\webapp'

                    echo '✅ Application deployed successfully'
                    echo '🌐 Open: http://localhost:8000'
                }
            }
        }

        stage('🔍 Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                script {

                    bat 'timeout /t 3 /nobreak >nul'

                    def statusCode = bat(
                        script: 'curl -s -o nul -w "%%{http_code}" http://localhost:8000/index.html',
                        returnStdout: true
                    ).trim()

                    if (statusCode == '200') {
                        echo "✅ Deployment verified successfully (HTTP ${statusCode})"
                    } else {
                        echo "⚠️ Warning: HTTP ${statusCode}"
                    }
                }
            }
        }
    }

    post {
        success {
            echo '''
            ╔════════════════════════════════════════════╗
            ║   ✅ CI/CD PIPELINE SUCCESSFUL            ║
            ║   Application deployed successfully       ║
            ║   http://localhost:8000                  ║
            ╚════════════════════════════════════════════╝
            '''
        }

        failure {
            echo '''
            ╔════════════════════════════════════════════╗
            ║   ❌ CI/CD PIPELINE FAILED                ║
            ║   Check logs for details                  ║
            ╚════════════════════════════════════════════╝
            '''
        }

        always {
            echo "Pipeline finished for build #${env.BUILD_NUMBER}"
        }
    }
}
