pipeline {
  agent any

  parameters {
    choice(name: 'TARGET_ENV', choices: ['dev', 'stage', 'prod'], description: 'Deployment environment')
    string(name: 'IMAGE_TAG', defaultValue: '', description: 'Optional image tag override')
    booleanParam(name: 'DEPLOY', defaultValue: true, description: 'Deploy after build')
  }

  environment {
    APP_NAME = 'lavendertour'
    AWS_REGION = 'ap-south-1'
    ECR_REGISTRY = credentials('aws-ecr-registry')
    SSH_KEY = 'lavendertour-ssh'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Resolve Build Metadata') {
      steps {
        script {
          env.GIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          env.RESOLVED_TAG = params.IMAGE_TAG?.trim() ? params.IMAGE_TAG.trim() : "${params.TARGET_ENV}-${env.BUILD_NUMBER}-${env.GIT_SHA}"
          env.DEPLOY_HOST = [
            dev: 'dev.lavendertour.in',
            stage: 'stage.lavendertour.in',
            prod: 'lavendertour.in'
          ][params.TARGET_ENV]
        }
      }
    }

    stage('Backend Verify') {
      steps {
        dir('backend') {
          sh 'python3 -m venv .venv'
          sh '. .venv/bin/activate && pip install -r requirements.txt'
          sh '. .venv/bin/activate && PYTHONPYCACHEPREFIX=.pycache python -m compileall app'
        }
      }
    }

    stage('Frontend Verify') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh "docker build -t ${APP_NAME}-backend:${RESOLVED_TAG} ./backend"
        sh "docker build -t ${APP_NAME}-frontend:${RESOLVED_TAG} ./frontend"
      }
    }

    stage('Push Images') {
      when {
        expression { return params.TARGET_ENV != 'dev' }
      }
      steps {
        sh """
          docker tag ${APP_NAME}-backend:${RESOLVED_TAG} ${ECR_REGISTRY}/${APP_NAME}-backend:${RESOLVED_TAG}
          docker tag ${APP_NAME}-frontend:${RESOLVED_TAG} ${ECR_REGISTRY}/${APP_NAME}-frontend:${RESOLVED_TAG}
          aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
          docker push ${ECR_REGISTRY}/${APP_NAME}-backend:${RESOLVED_TAG}
          docker push ${ECR_REGISTRY}/${APP_NAME}-frontend:${RESOLVED_TAG}
        """
      }
    }

    stage('Deploy') {
      when {
        expression { return params.DEPLOY }
      }
      steps {
        withCredentials([
          sshUserPrivateKey(credentialsId: env.SSH_KEY, keyFileVariable: 'SSH_PRIVATE_KEY', usernameVariable: 'SSH_USER')
        ]) {
          sh """
            chmod +x deploy/deploy.sh
            TARGET_ENV=${params.TARGET_ENV} \\
            IMAGE_TAG=${RESOLVED_TAG} \\
            DEPLOY_HOST=${DEPLOY_HOST} \\
            ECR_REGISTRY=${ECR_REGISTRY} \\
            SSH_USER=${SSH_USER} \\
            SSH_PRIVATE_KEY=${SSH_PRIVATE_KEY} \\
            ./deploy/deploy.sh
          """
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'frontend/.next/**, backend/.pycache/**', allowEmptyArchive: true
    }
  }
}
