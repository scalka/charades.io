/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package udpclient;

import java.util.Scanner;
import java.io.*;
import java.net.*;

class UDPClient {
	public static void main(String [] args) throws Exception{
		String sentence;
		String modifiedSentence;
		Scanner inFromUser = new Scanner(System.in);
		DatagramSocket clientSocket = new DatagramSocket();
		InetAddress IPAddress = InetAddress.getByName("localhost");
		byte[] sendData = new byte[1024];
		byte[] receiveData = new byte[1024];
		System.out.println("Please enter a message to send to the server:");
		sentence = inFromUser.nextLine();
		sendData = sentence.getBytes();
		DatagramPacket sendPacket = 
			new DatagramPacket(sendData, sendData.length,IPAddress,9876);
		clientSocket.send(sendPacket);
		DatagramPacket receivePacket = 
			new DatagramPacket(receiveData, receiveData.length);
		clientSocket.receive(receivePacket);
		modifiedSentence = new String(receivePacket.getData());
		System.out.println("FROM SERVER: " + modifiedSentence);
		clientSocket.close();
	}
}

