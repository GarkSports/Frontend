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
                bat 'docker build -t spr01-front .'
                }
            }
        }
       stage('Tag') {
            steps {
                script {
                bat 'docker tag spr01-front khaledsd/spr01-front'
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


