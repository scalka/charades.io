/*
 * in UDP every packet needs IP address and port
 */
package udpserver;
import java.io.*;
import java.net.*;
import java.util.Scanner;

class UDPServer{
	public static void main(String [] args) throws Exception{
		DatagramSocket serverSocket = new DatagramSocket(9876);
		byte[] sendData = new byte[1024];
		byte[] receiveData = new byte[1024];
                //want to keep listening and respond over and over again
		while(true){
			DatagramPacket receivePacket = 
				new DatagramPacket(receiveData, receiveData.length);
                        //this line changes receive packet, 
                        //serverSockets waits until it receive packed when it receives it puts it in reveivePacet
                        //pass by reference
			serverSocket.receive(receivePacket);
                        //get data (bytes)out of packed and build new string
			String clientSentence = 
				new String(receivePacket.getData(),0,receivePacket.getLength());
                        String capitalizedSentence = clientSentence.toUpperCase();
                        sendData = capitalizedSentence.getBytes();
                        
                        //gets machine
			InetAddress IPAddress = receivePacket.getAddress();
                        //gets port
			int port = receivePacket.getPort();			
                        //show received message
                        System.out.println("Received message: " + clientSentence);
                        
                        Scanner scanner = new Scanner (System.in);
                        String reply = scanner.nextLine();	
                        sendData = reply.getBytes();

                        //building packer with data, length, ip where to send it and port from reveivepacked
			DatagramPacket sendPacket =
				new DatagramPacket(sendData,sendData.length, IPAddress, port);
			serverSocket.send(sendPacket);
		}
	}
}
