pipeline {
    agent any
    
    environment {
        // GitHub Repository Configuration
        GIT_REPO = 'https://github.com/yourusername/naan-mudhalvan-devops-project.git'
        GIT_BRANCH = 'main'
        
        // Build Configuration
        MAVEN_HOME = tool 'Maven-3.8'
        JAVA_HOME = tool 'JDK-11'
        
        // Tomcat Deployment Configuration (if using Tomcat)
        TOMCAT_URL = 'http://localhost:8080/manager/text'
        TOMCAT_CRED = 'tomcat-credentials'
        DEPLOY_PATH = '/var/www/html/student-app'
    }
    
    stages {
        stage('📦 Checkout Code') {
            steps {
                echo 'Cloning repository from GitHub...'
                git branch: "${GIT_BRANCH}", 
                    url: "${GIT_REPO}",
                    credentialsId: 'github-credentials'
                echo '✅ Code successfully checked out'
            }
        }
        
        stage('🔧 Build Application') {
            steps {
                echo 'Building project with Maven...'
                withEnv(["JAVA_HOME=${JAVA_HOME}", "PATH+MAVEN=${MAVEN_HOME}/bin:${JAVA_HOME}/bin"]) {
                    sh 'mvn clean compile'
                    sh 'mvn package -DskipTests'
                }
                echo '✅ Build completed successfully'
            }
        }
        
        stage('🧪 Run Tests') {
            steps {
                echo 'Running unit tests...'
                withEnv(["JAVA_HOME=${JAVA_HOME}", "PATH+MAVEN=${MAVEN_HOME}/bin:${JAVA_HOME}/bin"]) {
                    sh 'mvn test'
                }
                echo '✅ All tests passed'
            }
        }
        
        stage('📄 Generate Artifact') {
            steps {
                echo 'Generating deployment artifact...'
                sh '''
                    echo "========================================="
                    echo "Build Information:"
                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Build Timestamp: ${BUILD_TIMESTAMP}"
                    echo "Git Commit: ${GIT_COMMIT}"
                    echo "========================================="
                '''
                archiveArtifacts artifacts: 'target/*.war', fingerprint: true
                echo '✅ Artifact generated and archived'
            }
        }
        
        stage('🚀 Deploy to Server') {
            steps {
                echo 'Deploying application...'
                
                // Option 1: Deploy to Local HTTP Server
                sh '''
                    # Stop existing service if running
                    pkill -f "python3 -m http.server 8000" || true
                    
                    # Copy files to deployment directory
                    mkdir -p ${DEPLOY_PATH}
                    cp -r src/main/webapp/* ${DEPLOY_PATH}/
                    
                    # Start HTTP server for serving static files
                    cd ${DEPLOY_PATH}
                    nohup python3 -m http.server 8000 > server.log 2>&1 &
                '''
                
                echo '✅ Application deployed successfully!'
                echo "🌐 Access the application at: http://localhost:8000"
            }
        }
        
        stage('🔍 Verify Deployment') {
            steps {
                echo 'Verifying deployment...'
                script {
                    def statusCode = sh(
                        script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/index.html",
                        returnStdout: true
                    ).trim()
                    
                    if (statusCode == '200') {
                        echo "✅ Verification successful! HTTP Status: ${statusCode}"
                    } else {
                        error "❌ Verification failed! HTTP Status: ${statusCode}"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '''
            ╔══════════════════════════════════════════════════════════════╗
            ║                                                              ║
            ║     ✅  CI/CD PIPELINE EXECUTED SUCCESSFULLY  ✅            ║
            ║                                                              ║
            ║     Project: Naan Mudhalvan DevOps Project                   ║
            ║     Status: DEPLOYMENT SUCCESSFUL                            ║
            ║                                                              ║
            ║     Access the website at: http://localhost:8000             ║
            ║                                                              ║
            ╚══════════════════════════════════════════════════════════════╝
            '''
        }
        failure {
            echo '''
            ╔══════════════════════════════════════════════════════════════╗
            ║                                                              ║
            ║     ❌  CI/CD PIPELINE FAILED  ❌                            ║
            ║                                                              ║
            ║     Please check the build logs for more details.            ║
            ║                                                              ║
            ╚══════════════════════════════════════════════════════════════╝
            '''
        }
        always {
            echo "Pipeline execution completed for build #${BUILD_NUMBER}"
            cleanWs()
        }
    }
}
