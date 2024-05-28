pipeline {
    environment {
        registry = "khaledsd/spr01-front"
        registryCredential = 'docker2'
        dockerImage = ''
    }
    agent any
    stages {
       stage('Build') {
            steps {
                script {
                bat 'docker build -t $registry:$BUILD_NUMBER .'
                }
            }
        }
        stage('Push') {
            steps {
                script {
                bat 'docker push $registry:$BUILD_NUMBER'
                }
            }
        }

//         stage('Trigger PipelineJob2') {
//             steps {
//                 script {
//                         build job: 'CD pipe/main', wait: false
//                 }
//             }
//         }


    }
}


