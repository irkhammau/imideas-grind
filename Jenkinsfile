pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        COMPOSE_PROJECT_NAME = 'imideas-grind'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'imideas-grind-env',
                        variable: 'APP_ENV_FILE'
                    )
                ]) {
                    sh '''
                        docker compose build app
                    '''
                }
            }
        }

        stage('Run Migration') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'imideas-grind-env',
                        variable: 'APP_ENV_FILE'
                    )
                ]) {
                    sh '''
                        docker compose run --rm --no-deps app \
                          npx prisma migrate deploy --schema=./prisma/schema.prisma
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'imideas-grind-env',
                        variable: 'APP_ENV_FILE'
                    )
                ]) {
                    sh '''
                        if docker container inspect imideas-grind >/dev/null 2>&1; then
                            if ! docker container inspect \
                                --format '{{ index .Config.Labels "com.docker.compose.project" }}' \
                                imideas-grind | grep -qx "$COMPOSE_PROJECT_NAME"; then
                                echo 'Replacing the legacy non-Compose container once'
                                docker container rm -f imideas-grind
                            fi
                        fi

                        docker compose up -d --no-deps app
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'imideas-grind-env',
                        variable: 'APP_ENV_FILE'
                    )
                ]) {
                    sh '''
                        docker compose ps app
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    docker image prune -f
                '''
            }
        }
    }
}
