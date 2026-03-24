pipeline {
  agent any

  parameters {
    booleanParam(name: 'DEPLOY', defaultValue: true, description: 'Deploy after build')
  }

  environment {
    VPS_HOST = '31.97.202.218'
    VPS_USER = 'root'
    SSH_CREDENTIALS = 'lavendertour-vps-ssh'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Resolve Environment') {
      steps {
        script {
          env.RESOLVED_ENV = [
            'dev': 'dev',
            'stage': 'stage',
            'prod': 'prod',
            'main': 'prod'
          ][env.BRANCH_NAME]

          if (!env.RESOLVED_ENV) {
            error("Unsupported branch '${env.BRANCH_NAME}'. Only dev, stage, prod, or main are deployable.")
          }
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
          sh 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH" && npm ci'
          sh 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH" && npm run build'
        }
      }
    }

    stage('Deploy To VPS') {
      when {
        expression { return params.DEPLOY }
      }
      steps {
        sshagent(credentials: [env.SSH_CREDENTIALS]) {
          sh """
            ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} \\
              '/opt/lavendertour/deploy-by-branch.sh ${RESOLVED_ENV}'
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
