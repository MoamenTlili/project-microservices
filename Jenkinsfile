pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('63fd3a88-d36b-479e-863b-a0881fde4f7e')
        DOCKER_HUB_REPO = 'moamrn'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/MoamenTlili/project-microservices.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = ['apiGateway', 'books-service', 'users-service']
                    services.each { service ->
                        // Build Docker images for each service
                        sh "docker build -t ${env.DOCKER_HUB_REPO}:${service} ./${service}"
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    // Explicit login to Docker Hub
                    echo "Logging into Docker Hub as ${env.DOCKER_HUB_REPO}"
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_HUB_CREDENTIALS) {
                        echo "Successfully logged into Docker Hub."
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Push the Docker images to Docker Hub
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_HUB_CREDENTIALS) {
                        def services = ['apiGateway', 'books-service', 'users-service']
                        services.each { service ->
                            sh "docker push ${env.DOCKER_HUB_REPO}:${service}"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}





/*pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('63fd3a88-d36b-479e-863b-a0881fde4f7e')
        DOCKER_HUB_REPO = 'moamrn'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = ['apiGateway', 'books-service', 'users-service']
                    services.each { service ->
                        sh "docker build -t ${env.DOCKER_HUB_REPO}:${service} ./${service}"
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    // Use the credentials reference from the environment variable
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_HUB_CREDENTIALS) {
                        // Docker login will be handled here automatically
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Use the credentials reference from the environment variable
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_HUB_CREDENTIALS) {
                        def services = ['apiGateway', 'books-service', 'users-service']
                        services.each { service ->
                            sh "docker push ${env.DOCKER_HUB_REPO}:${service}"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}*/




/*pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('63fd3a88-d36b-479e-863b-a0881fde4f7e') 
        DOCKER_HUB_REPO = 'moamrn' 
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = ['apiGateway', 'books-service', 'users-service'] // Correct service names here
                    services.each { service ->
                        sh "docker build -t ${env.DOCKER_HUB_REPO}:${service} ./${service}" // Builds Docker images for each service
                    }
                }
            }
        }


        stage('Login to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'Docker Hub Credentials') {
                        // Docker login will be handled here automatically
                    }
                }
            }
        }




        
        /*stage('Scan Docker Images') {
            steps {
                script {
                    sh '''
                    trivy image --exit-code 1 --severity HIGH,CRITICAL --skip-update --light moamrn:apiGateway
                    trivy image --exit-code 1 --severity HIGH,CRITICAL --skip-update --light moamrn:books-service
                    trivy image --exit-code 1 --severity HIGH,CRITICAL --skip-update --light moamrn:users-service
                    '''
                }
            }
        }
        /*stage('Scan Docker Images') {
            steps {
                script {
                    def services = ['apiGateway', 'books-service', 'users-service']
                    services.each { service ->
                        sh """
                        trivy image --exit-code 1 --severity HIGH,CRITICAL --skip-db-update --scanners vuln moamrn:${service}
                        """
                    }
                }
            }
        }


        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', env.DOCKER_HUB_CREDENTIALS) {
                        def services = ['apiGateway', 'books-service', 'users-service'] // Correct service names here
                        services.each { service ->
                            sh "docker push ${env.DOCKER_HUB_REPO}:${service}"
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}*/
