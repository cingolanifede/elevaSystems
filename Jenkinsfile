pipeline {
    agent any
    
    environment {
        DB_MAIN_HOST = "mongo"
        DB_MAIN_USER = "adminCingolani"
        DB_MAIN_PASS = "cingolani481"
        DB_MAIN_NAME = "eleva"
        TOKEN_SECRET = "elevasystems"
    }
    
    stages {

        stage("Build")
        {
            steps
            {
                script {
                        echo "INFO: Build Stage"
                        sh "docker build -t elevasystems-backend:latest ."
                        echo "INFO: Docker image built"
                    }
            }
        }

        stage("Deploy")
        {
            steps
            {
                script {
                        echo "INFO: Running new Docker image"
                        sh "docker rm -f elevasystems-backend_local || true"
                        sh "docker run -d --restart always \
                        -e NODE_ENV="local"
                        -e DB_MAIN_HOST="${DB_MAIN_HOST}"
                        -e DB_MAIN_USER="${DB_MAIN_USER}"
                        -e DB_MAIN_PASS="${DB_MAIN_PASS}"
                        -e DB_MAIN_NAME="${DB_MAIN_NAME}"
                        -e TOKEN_SECRET="${TOKEN_SECRET}"
                        -e VIRTUAL_PORT="3000"
                        -e VIRTUAL_HOST="api.elevasystems.com.ar"
                        -e LETSENCRYPT_HOST="api.elevasystems.com.ar"
                        -e LETSENCRYPT_EMAIL="cingolanifede@elevasystems.com.ar"
                        --expose 3000 \
                        --expose 25 \
                        --name elevasystems-backend_local elevasystems-backend:latest"
                        echo "INFO: Deployed"
                    }
            }
        }
    }
}