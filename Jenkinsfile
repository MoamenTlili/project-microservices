pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('8882bc7e-4ee8-42c5-9840-dd467cdf703a') // Replace with your Jenkins credentials ID
        DOCKER_HUB_REPO = 'moamrn' // Replace with your Docker Hub repository name
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
        }*/
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
        }*/


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
}
