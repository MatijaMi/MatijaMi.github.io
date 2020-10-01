import org.json.JSONArray;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Main {

    public static void main(String[] args) throws IOException {
        startProgramUi();
    }
//File chooser code
    private static Path startFileChooser(JFrame f){
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setFileFilter(new FileNameExtensionFilter("JSON","json"));
        fileChooser.setCurrentDirectory(new File(System.getProperty("user.home")));
        fileChooser.setDialogTitle("Choose A File");
        int result = fileChooser.showOpenDialog(f);
        if (result == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            System.out.println("Selected file: " + selectedFile.getAbsolutePath());
            return selectedFile.toPath();
        }
        return null;
    }
//Function that turns JSON files into images
    private static void createImage(Path input, String output) throws IOException {
            JSONArray arr = new JSONArray(Files.readString(input, StandardCharsets.US_ASCII));
            int mode = 0;
            int w = 0;

            if(arr.getJSONArray(0).length()==1){//For special Images
                mode = arr.getJSONArray(0).getInt(0);
                arr.remove(0);
                if(mode!=-3) {//CFA Image
                    w = arr.getJSONArray(0).length();
                }else{//s/mRaw image
                    w = arr.getJSONArray(0).length()/3;
                }
            }else{//Processed RGB Image
                w = arr.getJSONArray(0).length()/3;
            }
            int h = arr.length();
            BufferedImage image = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);

            if(mode==0 || mode ==-3){//RGB Images
                double div=10000;
                if (mode==-3){
                    div = Math.pow(2,16);//s/mRaws
                }
                float r, g, b;
                for (int i = 0; i < arr.length(); i++) {
                    for (int j = 0; j < arr.getJSONArray(i).length(); j += 3) {
                        r = (float) Math.abs(arr.getJSONArray(i).getDouble(j) / div);
                        g = (float) Math.abs(arr.getJSONArray(i).getDouble(j + 1) / div);
                        b = (float) Math.abs(arr.getJSONArray(i).getDouble(j + 2) / div);
                        Color rgbc = new Color(r, g, b);
                        image.setRGB(j / 3, i, rgbc.getRGB());
                    }
                }
            }else{//CFA Images
                float c;
                double div =10000;
                if(mode ==-1){
                    div = Math.pow(2,16);
                }
                for (int i = 0; i < arr.length(); i++) {
                    for (int j = 0; j < arr.getJSONArray(i).length(); j ++) {
                        c = (float) (arr.getJSONArray(i).getDouble(j) / div);
                        if(i%2==0){
                            if(j%2==0){
                                Color rgbc = new Color(c, 0, 0);
                                image.setRGB(j, i, rgbc.getRGB());
                            }else{
                                Color rgbc = new Color(0, c, 0);
                                image.setRGB(j, i, rgbc.getRGB());
                            }
                        }else{
                            if(j%2==0){
                                Color rgbc = new Color(0, c,0);
                                image.setRGB(j, i, rgbc.getRGB());
                            }else{
                                Color rgbc = new Color(0,0, c);
                                image.setRGB(j, i, rgbc.getRGB());
                            }
                        }
                    }
                }
            }
            File outputfile = new File(output);
            ImageIO.write(image, "jpg", outputfile);
    }
////////////////////////// UI CODE/////////////////////////////
    private static void startProgramUi(){
        JFrame f = new JFrame("CR2 JSON to Image");
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setSize(new Dimension(600, 150));
        f.setMaximumSize(new Dimension(800,200));
        f.setLocation(400,400);

        JPanel directoryPanel = new JPanel();
        JPanel inputField = new JPanel();
        inputField.setSize(450,100);

        JPanel outputField = new JPanel();
        outputField.setSize(450,100);

        JPanel buttonFrame = new JPanel();

        final JLabel inputTitle = new JLabel("Chosen File:");
        final JTextField inputDirectory = new JTextField(40);
        inputDirectory.setSize(300,30);
        inputDirectory.setBackground(Color.WHITE);
        inputDirectory.setEditable(false);

        final JLabel outputTitle = new JLabel("Output File:");
        final JTextField outputDirectory = new JTextField(40);
        outputDirectory.setSize(300,30);
        outputDirectory.setBackground(Color.WHITE);

        inputField.add(inputTitle);
        inputField.add(inputDirectory);
        outputField.add(outputTitle);
        outputField.add(outputDirectory);

        final JButton choosePath = new JButton("Choose .JSON File");
        choosePath.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Path filePath =startFileChooser(f);
                if(filePath!=null) {
                    inputDirectory.setText(filePath.toString());
                    outputDirectory.setText(filePath.toString().replace(".json",".jpg"));
                    f.revalidate();
                }
            }
        });

        final JButton startButton = new JButton("Convert to .jpg");
        startButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    createImage(Paths.get(inputDirectory.getText()),outputDirectory.getText());
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        });

        directoryPanel.add(BorderLayout.NORTH,inputField);
        directoryPanel.add(BorderLayout.SOUTH,outputField);
        f.getContentPane().add(directoryPanel);

        buttonFrame.add(BorderLayout.WEST,choosePath);
        buttonFrame.add(BorderLayout.EAST,startButton);
        f.getContentPane().add(BorderLayout.SOUTH, buttonFrame);

        f.setVisible(true);
    }
}
