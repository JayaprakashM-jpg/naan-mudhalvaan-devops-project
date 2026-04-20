pipeline {
    agent any

    tools {
        maven 'Maven-3.9'   // 👈 MUST match the name in Jenkins
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
        
        stage('🚀 Deploy to Server') {
            steps {
                echo 'Deploying application...'
                script {
                    bat 'for /f "tokens=5" %%a in (\'netstat -aon ^| find ":8000" ^| find "LISTENING"\') do taskkill /F /PID %%a 2>nul || exit 0'
                    bat 'mkdir C:\\temp\\webapp 2>nul || exit 0'
                    bat 'xcopy /E /I /Y src\\main\\webapp\\* C:\\temp\\webapp\\'
                    bat 'start /B python -m http.server 8000 --directory C:\\temp\\webapp'

                    echo '✅ Application deployed!'
                    echo '🌐 Access at: http://localhost:8000'
                }
            }
        }
        
        stage('🔍 Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                script {
                    bat 'timeout /t 2 /nobreak >nul'
                    
                    def statusCode = bat(
                        script: 'curl -s -o nul -w "%%{http_code}" http://localhost:8000/index.html',
                        returnStdout: true
                    ).trim()
                    
                    if (statusCode == '200') {
                        echo "✅ Verification successful! HTTP Status: ${statusCode}"
                    } else {
                        echo "⚠️ Verification returned: ${statusCode}"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ CI/CD PIPELINE SUCCESSFUL'
        }
        failure {
            echo '❌ CI/CD PIPELINE FAILED'
        }
        always {
            echo "Pipeline execution completed for build #${env.BUILD_NUMBER}"
        }
    }
}
