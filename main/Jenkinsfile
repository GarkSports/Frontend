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
                   dockerImage = docker.build registry + ":$BUILD_NUMBER"
                }
            }
        }
        stage('Push') {
            steps {
                script {
                    docker.withRegistry( '', registryCredential ) {
                                            dockerImage.push()
                                        }
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


