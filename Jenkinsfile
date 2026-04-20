pipeline {
    agent any

    // 🔧 THIS IS THE KEY PART - Declare the tools
    tools {
        maven 'Maven-3.9'    // Must match the name in Jenkins Tools
        jdk 'JDK-21'         // Must match the name in Jenkins Tools
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Build with Maven') {
            steps {
                echo '🔨 Building project with Maven...'
                bat 'mvn clean compile'
            }
        }

        stage('Package') {
            steps {
                echo '📦 Creating JAR/WAR package...'
                bat 'mvn package -DskipTests'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running unit tests...'
                bat 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Run Application') {
            steps {
                echo '🚀 Running the Java application...'
                bat '''
                    cd target
                    java -jar *.jar
                '''
            }
        }
    }

    post {
        success {
            echo '''
            ╔══════════════════════════════════════════════════════════════╗
            ║                                                              ║
            ║     ✅  BUILD SUCCESSFUL WITH MAVEN & JAVA 21  ✅           ║
            ║                                                              ║
            ║     Artifacts are available in the "target" folder           ║
            ║                                                              ║
            ╚══════════════════════════════════════════════════════════════╝
            '''
        }
        failure {
            echo '❌ Build failed! Check the logs above.'
        }
        always {
            cleanWs()
        }
    }
}
