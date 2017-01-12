/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package udpserver;
import java.io.*;
import java.net.*;

class UDPServer{
	public static void main(String [] args) throws Exception{
		DatagramSocket serverSocket = new DatagramSocket(9876);
		byte[] sendData = new byte[1024];
		byte[] receiveData = new byte[1024];
		while(true){
			DatagramPacket receivePacket = 
				new DatagramPacket(receiveData, receiveData.length);
			serverSocket.receive(receivePacket);
			String clientSentence = 
				new String(receivePacket.getData(),0,receivePacket.getLength());
			InetAddress IPAddress = receivePacket.getAddress();
			int port = receivePacket.getPort();
			String capitalizedSentence = clientSentence.toUpperCase();
			sendData = capitalizedSentence.getBytes();
			DatagramPacket sendPacket =
				new DatagramPacket(sendData,sendData.length, IPAddress, port);
			serverSocket.send(sendPacket);
		}
	}
}
