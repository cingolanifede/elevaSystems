pipeline {
    agent any
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
                        sh "docker run --restart always --expose 3000 -d --name elevasystems-backend_local elevasystems-backend:latest"
                        echo "INFO: Deployed"
                    }
            }
        }
    }
}
