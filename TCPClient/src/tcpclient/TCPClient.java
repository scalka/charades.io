package tcpclient;
import java.util.Scanner;
import java.io.*;
import java.net.*;

public class TCPClient {

    public static void main(String [] args) throws Exception{
		String sentence;
		String modifiedSentence;
		Scanner inFromUser = new Scanner(System.in);
		Socket clientSocket = new Socket("172.18.15.57", 6788);
		DataOutputStream outToServer = 
			new DataOutputStream(clientSocket.getOutputStream());
		BufferedReader inFromServer =
			new BufferedReader(new InputStreamReader(
				clientSocket.getInputStream()));
                
                sentence = "";
                
		while(!sentence.equals("quit")){
                    System.out.println("Please enter a message to send to the server:");
                    sentence = inFromUser.nextLine();
                    outToServer.writeBytes(sentence + '\n');
                    System.out.println("FROM SERVER: " + inFromServer.readLine());
                }
		clientSocket.close();
	}
}
