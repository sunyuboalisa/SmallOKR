pipeline {
    agent any
    stages {
        // 1. 拉取代码
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sunyuboalisa/SmallOKR.git'
            }
        }

        // 2. 设置 Java 环境
        stage('Set Up Java') {
            steps {
                sh 'sudo apt-get update -y'
                sh 'sudo apt-get install -y openjdk-17-jdk'
                sh 'java -version'
            }
        }

        // 3. 构建 Spring Boot 项目
        stage('Build') {
            steps {
                dir('./smallokr_server') {
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        // 4. 测试（可选）
        stage('Test') {
            steps {
                dir('./smallokr_server') {
                    sh './mvnw test'
                }
            }
        }
    }
}
