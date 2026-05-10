pipeline {
    agent any

    environment {
        APP_NAME = 'imideas-grind'
        DOCKER_IMAGE = 'imideas-grind:latest'
        DOCKER_NETWORK = 'imideas-net'

        DATABASE_URL = 'mysql://root:P%40ssw0rd@mysql-lab:3306/grind_db'
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
                    --network $DOCKER_NETWORK \
                    -e DATABASE_URL="$DATABASE_URL" \
                    -e NEXTAUTH_URL="$NEXTAUTH_URL" \
                    -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
                    $DOCKER_IMAGE \
                    ./node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma
                '''
            }
        }

        stage('Run Seed') {
            steps {
                sh '''
                    docker run --rm \
                    --network $DOCKER_NETWORK \
                    -e DATABASE_URL="$DATABASE_URL" \
                    -e NEXTAUTH_URL="$NEXTAUTH_URL" \
                    -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
                    $DOCKER_IMAGE \
                    ./node_modules/.bin/prisma db seed --schema=./prisma/schema.prisma
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop $APP_NAME || true
                    docker rm $APP_NAME || true

                    docker run -d \
                    --name $APP_NAME \
                    --restart unless-stopped \
                    --network $DOCKER_NETWORK \
                    -e DATABASE_URL="$DATABASE_URL" \
                    -e NEXTAUTH_URL="$NEXTAUTH_URL" \
                    -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
                    $DOCKER_IMAGE
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
