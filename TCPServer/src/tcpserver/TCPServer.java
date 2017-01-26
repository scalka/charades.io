package tcpserver;import java.io.*;
import java.net.*;
import sun.rmi.runtime.Log;

public class TCPServer {
    public static void main(String [] args) throws Exception{
        String clientSentence;
        String capitalizedSentence;
        ServerSocket welcomeSocket = new ServerSocket(6788); // welcome socket

        while(true){
                Socket connectionSocket = welcomeSocket.accept();
                
                BufferedReader inFromClient = 
                        new BufferedReader(new InputStreamReader(
                                connectionSocket.getInputStream()));

                DataOutputStream outToClient = 
                        new DataOutputStream(connectionSocket.getOutputStream());
                
                clientSentence = "";
                
                while ( !clientSentence.equals("quit") ){
                    clientSentence = inFromClient.readLine();
                    capitalizedSentence = 
                            clientSentence.toUpperCase();

                    System.out.println("FROM CLIENT: " + clientSentence);

                    if (clientSentence.equals("HELLO")){
                        capitalizedSentence = "hey";

                    } else {
                        capitalizedSentence = "else";

                    }

                    System.out.println("to Client:" + capitalizedSentence);
                    // important - '\n' - end of line/message
                    //getPort gets port that clien is using 
                    System.out.println(connectionSocket.getLocalSocketAddress().toString());
                    outToClient.writeBytes(capitalizedSentence + connectionSocket.getPort() +'\n');
                }   
        }
    }
    
}
