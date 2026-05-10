pipeline {
    agent any

    environment {
        APP_NAME = 'imideas-grind'
        DOCKER_IMAGE = 'imideas-grind:latest'
        DOCKER_NETWORK = 'imideas-net'

        DATABASE_URL = 'mysql://root:P@ssw0rd@mysql-lab:3306/grind_db'
        NEXTAUTH_URL = 'https://grind.imideas.my.id'
        NEXTAUTH_SECRET = 'gtZoGuDkMNrAVN1tPfVDfBeu2i7+HU8th1XpC8gLOB4='
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $DOCKER_IMAGE .
                '''
            }
        }

        stage('Run Migration') {
            steps {
                sh '''
                    docker run --rm \
                    --network imideas-net \
                    --env-file /opt/imideas/env/imideas-grind.env \
                    imideas-grind:latest \
                    npx prisma migrate deploy
                '''
            }
        }

        stage('Run Seed') {
            steps {
                sh '''
                    docker run --rm \
                    --network imideas-net \
                    --env-file /opt/imideas/env/imideas-grind.env \
                    imideas-grind:latest \
                    npx prisma db seed
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop imideas-grind || true
                    docker rm imideas-grind || true

                    docker run -d \
                    --name imideas-grind \
                    --restart unless-stopped \
                    --network imideas-net \
                    --env-file /opt/imideas/env/imideas-grind.env \
                    imideas-grind:latest
                '''
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