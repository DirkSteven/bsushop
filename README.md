

# BatState-U Community Marketplace

<br> A proposed community marketplace for Batangas State University. A centralized shop for students' educational necessities while also allowing students to offer their service and products in the community. 
<br><br>

## Installation and Set-up
  &nbsp;&nbsp;&nbsp; First install the dependencies required on the requirements.txt. To do this run  the `terminal` and enter the command below.

``` powershell
    pip install -r requirements.r
```
&nbsp;&nbsp;&nbsp; To run the program, open the `termminal` and navigate on the project directory using `cd` then run the command below.
```powershell
  python run.py
```

## Table of Contents

### [1. Objective](#obj)
### [2. Project Overview](#proj-obv) 
- #### [The Database](#steg-info)
- #### [OOP Concepts](#LSB)
- #### [File Structure](#LSB)
### [3. Code Overview](#code-info)
### [4. Tools](#tools) 
### [5. Roadmap](#roadm) 
### [6. Future](#roadm) 
### [7. Contributors](#contrib) 
### [8. Notes](#notes) 

<br><br>

## <a id = "proj-obv"> 🎯Project Overview </a> <br>
 This project is a id-generaeting software etc etc etc 
1. ID-image Generator: One of the features of this product is the ability to create identification card images. These images include a photo of the person, as well as their personal information such as name, date of birth, and ID number.

2. Secured ID-image: the generated output goes a step further in terms of security by incorporating image steganography; an image that contains hidden information or data that can only be accessed by authorized individuals. 

3. Embed specific "message" in an image: Another feature of this product allows for the embedding of a specific message or authentication code within the image. However, this feature is only accessible to university administrators. It can be utilized to indicate an individual's position within the university.

4. ID-Scanner: The last feature allows it to read and scan and images to seek for concealed information. This will make it easier to verify that the file is authentic and not a falsification.
<br><br>


##  <a id = "obj"> 📈 Objective </a><br>
The project is aligned with the 17 Sustainable Development Goals (SDG), specifically the following:

> 8th Decent Work and Economic Growth <br>
> 9th Industry, Innovation and Infrastracture <br>
> 11th Sustainable Cities and Communities <br>

<br>

##  <a id = "how-works"> ❓ The Database</a><br>
- <a id = "steg-info"> models.py </a>


models.py 

uses sqlite 

used a combination of an ORM and raw SQL for querying the database. 


The models.py contain the metadata of each table.  
  <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Steganography is the practice of hiding secret or confidential information within an innocent-looking carrier medium, such as an image, audio file, video, or even text, without arousing suspicion. It is a technique used to ensure the covert communication between two or more parties, with the goal of preventing the detection of the hidden information by unintended recipients. </p> &nbsp;

  <p><b> In this project, the medium in which the information will be embedded to is an image file. Furthermore, the project will be utilizing the concept of LSB to encode the data.  </p></b>


<br>

- <a id = "LSB"> Least Significant Bit (LSB) </a>
  <p> 
In LSB steganography, the least significant bit of each pixel in a digital image is modified to hide the secret message. By replacing the LSB with bits from the message, information can be concealed within the image while minimizing visual changes. Extracting the message involves retrieving the modified LSBs from selected pixels. LSB steganography has limitations and requires careful handling to maintain hidden data integrity and avoid detection. </p>

<p align = "center">
  <img src = "lsb.png" width = "10000" height = "300" style = "margin-left:2rem"> 
  <p style = "margin-top:-2rem; margin-left:8rem">(<b>Source</b>: "https://www.javatpoint.com/image-steganography-using-python)</a></p>
</p>

From the above image, we can observe that if we alter the Most Significant Bit (or MSB), it will have a larger impact on the final values; however, if we alter the Least Significant Bit (or LSB), the impact on the final value is minimal. Hence, we use Least Significant Bit (LSB) Steganography.  

```shell 
[(225, 12, 99), (155, 2, 50), (99, 51, 15), (15, 55, 22), (155, 61, 87), (63, 30, 17), (1, 55, 19), (99, 81, 66), (219l, 77, 91), (69, 39, 50), (18, 200, 33), (25, 54, 190)] 
```
With the help of the ASCII Table, we can convert the secret message into decimal values and then into a binary form: 0110100 0110101. Now, we can iterate through the pixel values one after one. Once we convert them into binary, we can replace each least significant bit with that message bits in a sequential manner (For instance, the binary of 225 is 11100001, we can then replace the last bit, the bit in the right (1), with the initial data bit (0) and so on). This will allow us to modify the values of the pixel by +1 or -1 only, which is not perceptible at all. The output values of the pixels after performing LSBS is as follows:
```shell 
[(224, 13, 99), (154, 3, 50), (98, 50, 15), (15, 54, 23), (154, 61, 87), (63, 30, 17), (1, 55, 19), (99, 81, 66), (219, 77, 91), (69, 39, 50), (18, 200, 33), (25, 54, 190)]  
```




<br><br>
#  <a id = "code-info"> Code Overview </a>
  <p>  </p>

## Debugging  

 &nbsp;&nbsp;&nbsp; When in development process or troubleshooting, it is advised to enable the debug mode. To run this open the `run.py` file and set `debug` to `True`. 
 > However, it is crucial to set it back to `False` when the product is in deployment phase as it may encounter security issues.

``` python
from pyceal import app


if __name__ =='__main__':
    app.run(debug=False) ### Set to True when debugging

```

## Static and Template Files

 &nbsp;&nbsp;&nbsp; Static files refers to the files that are unchanged when the application is running, this includes usually includes the **stylesheets**, **image folder** and **javascript** files. Templates refer to html files that will be used in the website

> As per Flask documentation, it is conventional to store the static and template files in a folder named `static` and `template` on the directory folder of the project name. 
<br>

``` console
├───pyceal
│   ├───static
│   │   ├───css
│   │   ├───images
│   │   └───js
│   ├───templates

```

## Steganography Script
  &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp; 
  This is the encode method inside the Generate_ID class. It takes in 3 arguments, first is the image file opened using pillow. Then the string message which will be embedded inside the image. Finally, the key in order to extract this message in the decode method which is also inside the Generate_ID class.



  ```python

 def encode_image(self, pil_img, message, key):
        # Open the image
        image = pil_img

        # Convert the image to RGB mode if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')

        message+= ' ' + key + ' '

        # Convert the message to binary
        binary_message = ''.join(format(ord(char), '08b') for char in message)

        # Get the size of the image
        width, height = image.size

        print(width, height)

        # Check if the message is too long to fit in the image
        if len(binary_message) > width * height:
            raise ValueError("Message too long to fit in image")

        # Iterate over each pixel in the image
        pixels = image.load()
        index = 0
        for x in range(width):
            for y in range(height):
                # Get the binary representation of the pixel value
                binary_pixel = format(pixels[x, y][0], '08b')

                # Replace the least significant bit with a bit from the message
                if index < len(binary_message):
                    new_binary_pixel = binary_pixel[:-1] + binary_message[index]
                    pixels[x, y] = (int(new_binary_pixel, 2), pixels[x, y][1], pixels[x, y][2])
                    index += 1

        # Save the encoded image
        return image

  ```
<br>

## Routes
  &nbsp;&nbsp;&nbsp; Modern web apps use a technique named routing. This helps the user remember the URLs. For instance, instead of having /booking.php they see /booking/. Instead of /account.asp?id=1234/ they’d see /account/1234/. In this project, the routes can be found at `routes.py` file. 

> &nbsp;&nbsp;&nbsp; The project contains 7 routes in total , its functions are detailed in the the code block below. 


```python
@app.route("/index") 
def root_page():
  return render_template('root_page.html', title="PyCeal | Secured ID Generator")
```
<b>This route refers to the index page of the website, it will display the template of root_page.html. Similar to other websites, this index page will serve as the front page of the website </b>
<br> 

```python
@app.route("/id_generator", methods=['GET', 'POST'])
def id_generator():
return render_template ('id_generator.html', form=form, title = "PyCeal | ID Generator")
```
<b>This route refers to the ID generator of the website. It will display the id_generator.html. This is the part of the website that creates the ID  </b>
<br>
```python
@app.route("/login", methods=['GET', 'POST'])
def login():
return render_template ('login.html', form=form, title ="PyCeal | Log In")
```
<b>This refers to the Log in Site of the website. It will display the template of login.html. This is used to log in and checked if there’s already a generated ID picture. </b>
<br>
```python
@app.route('/decode', methods=['GET', 'POST'])
@login_required
def decode():
  return render_template('decode.html', title="Decoder", form=form, data=data)
```
<b>This refers to the Decoder of the website. This is the decoder of the website to know if the ID that was used was not a counterfeit.</b>
<br>
```python
@app.route("/preview", methods=['GET', 'POST'])
@login_required
def preview():
return render_template ('preview.html', user=user, data=data, title="PyCeal | ID Generator")
```
<b>This route refers to the Preview of the website. It will display the generated ID picture. Shows the details of the name and the generated ID. </b>
<br>
``` python
@app.route('/logout')
def logout():
return redirect(url_for('root_page'))
```
<b>This route refers to the Log Out of the website. It will go back to the root_page.html. This is the part that saves your Log In details and generated ID picture.</b>
</br>
```python
@app.route('/download')
def download(): 
```
<b>
This route refers to the Download of the website. It will download the generated image.</b>
<br>

<br>


## Forms


  &nbsp;&nbsp;&nbsp; The Flask-WTF extension will be utilized to handle web forms in this application. It acts as a seamless integration between Flask and the WTForms package. This is the first of several Flask extensions that will be introduced, as extensions play a vital role in addressing challenges that Flask intentionally avoids taking a stance on.
  <br>
  
  
> Forms will be extensively used on different routes of the website, specifically `/id_generator` , `/login` and `/decode`. The obtained data will be passed on the `models.py` that will store the data on the database. These can be edited and found at `forms.py`, details are as follow below. 

```python
class ID_Form(FlaskForm):
```

><b>The class `ID_Form(FlaskForm)` will be the forms that will be used on the `id_generator.html` to obtain and generate data for the ID. </b>


<br>



```python

class LoginForm(FlaskForm):
```
><b> The class `LoginForm(FlaskForm)` will obtain the data passed on the login page and will pass the data and check if it the user is registered in the database. </b>




<br>

```python
class DecodeForm(FlaskForm):
```
><b> Similar to `LoginForm(FlaskForm)`, the `DecodeForm(FlaskForm)` will obtain an image data submitted on the decode page and compare the authenticity of the image submitted with regards to the similar file in the database.  </b><br>




<br>



## Models
  &nbsp;&nbsp;&nbsp; The data that will be stored in the database will be represented by a collection of classes, usually called database models. The ORM layer within SQLAlchemy will do the translations required to map objects created from these classes into rows in the proper database tables.

  In this project the database models are found in the `models.py` file. Data that are passed from the `forms.py` are passed here at `models.py` with their corresponding values. 


  ```python
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) ### Primary Key
    full_name = db.Column(db.String(20), unique=True, nullable=False)
    program = db.Column(db.String(20), nullable=True)
    year_validity = db.Column(db.String(20), nullable=True)
    sr_code = db.Column (db.String(8), unique=True, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=True)

    id_img_data = db.Column(db.LargeBinary, nullable=False)
    id_img_name = db.Column(db.Text, nullable=False)
    id_img_mimetype = db.Column(db.Text, nullable=False)
 
    sign_img_data = db.Column(db.LargeBinary, nullable=False)
    sign_img_name = db.Column(db.Text, nullable=False)
    sign_img_mimetype = db.Column(db.Text, nullable=False)

    contact_person = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(20), nullable=True)
    contact_number = db.Column(db.String(20), nullable=True)
  ```
  
  
  <b>`nullable`</b>: This attribute is used to specify whether a column can contain null values or not. When nullable is set to `True`, the column allows null values. When set to `False`, the column is marked as non-nullable, meaning it must always have a value. The default value of nullable is `True` if not explicitly specified.

  <b>`unique`</b>: This attribute is used to enforce uniqueness in the values of a column. When unique is set to True, the column's values must be unique across all rows in the table. Attempting to insert a duplicate value into a unique column will result in an integrity error. By default, `unique` is set to `False`.

  <b>`String`</b>: This is a data type in `SQLAlchemy` used to represent variable-length character strings. It corresponds to the `VARCHAR` column type in most databases. The String data type allows you to specify the maximum length of the string using the length parameter.

<br>

## Database Configuration 
&nbsp;&nbsp;&nbsp; Database profile and presets is found on the ``config.py`` file. 
> The preset configuration will create a database file named ``app.db``. 
  
   
<br>

##  <a id = "tools"> ⚒️ Tools and Dependencies </a><br>
The following listed tools are utilized in this project. <br>

- [x] Python 3.9.10 <br> 
- [x] Flask <br> 
- [x] HTML/CSS <br> 
- [x] Bootstrap <br> 
- [x] Javascript <br>

In addition, the dependencies and libraries that are found in the `requirements.txt` are listed below:
- [x]   alembic==1.12.1
- [x]   bcrypt==4.0.1
- [x]   blinker==1.7.0
- [x]   click==8.1.7
- [x]   colorama==0.4.6
- [x]   dnspython==2.4.2
- [x]   email-validator==2.1.0.post1
- [x]   Flask==3.0.0
- [x]   Flask-Bcrypt==1.0.1
- [x]   Flask-Login==0.6.3
- [x]   Flask-Migrate==4.0.5
- [x]   Flask-MySQLdb==2.0.0
- [x]   Flask-SQLAlchemy==3.1.1
- [x]   Flask-WTF==1.2.1
- [x]   greenlet==3.0.1
- [x]   idna==3.4
- [x]   importlib-metadata==6.8.0
- [x]   itsdangerous==2.1.2
- [x]   Jinja2==3.1.2
- [x]   Mako==1.3.0
- [x]   MarkupSafe==2.1.3
- [x]   mysqlclient==2.2.0
- [x]   SQLAlchemy==2.0.23
- [x]   typing_extensions==4.8.0
- [x]   Werkzeug==3.0.1
- [x]   WTForms==3.1.1
- [x]   zipp==3.17.0
<br>
##  <a id = "roadm"> 🛣️ Roadmap </a> <br>


Payment System
Migration to a Production Database
Enhanced Security Feature
App Policy for Products, Ordering and Payments. 
Improved Scalability accross different end-devices. 
Buyer and Seller interaction
Improved UI Design



| Goal # | Description | Date 
| --- | --- | --- | 
|  1 | System Design | March 30-April 2 |
|  2 | Front-end Development | April 3-6 |
|  3 | Back-end Development | April 6-12 | 
| <del> 4 </del> | <del> Code Integration </del> | <del>April 12-19 </del> |
|  5 | Debugging | April 20-24 |
|  6 | Documentation  | <del>April 24-26</del> <br> April 26- May 2|

<br>


##  <a id = "contrib"> 👷‍ Contributors </a> <br>

| Name | Role | E-mail | Other Contacts |
| --- | --- | --- | --- |
| <a href = "https://github.com/DirkSteven">Dirk Steven E. Javier</a> | Project Leader, Back-end, Front-end, and Database | dirkjaviermvp@gmail.com | Allonsy -Discord |
| <a href = "https://github.com/HusPhil">Fhil Joshua Caguicla </a>| Back-end, Front-end, Database | husphil200@gmail.com |  |
| <a href = "https://github.com/LanceAndrei04">Lance Andrei Espina </a>|  Front-end, Assets  | lanceandrei.espina30@gmail.com |  |
| <a href = "https://github.com/VinceAbella">Vince Jericho Abella </a>| Front-end | vinceabella07@gmail.com |  |


<br>


##  <a id = "notes"> 📝 Notes </a><br>
[1] ***An electronic signature should be uploaded on a white background to make the conversion to transparent PNG easier.***

[2] ***It is advised for users to submit PNG files for their image uploads as it can keep quality better and work well with detailed, high-contrast photos. The files size is also significantly larger, addressing any potential data shortage.***

<br><br>



# bsushop

##  <a id = "timeline"> ⌚ Timeline </a> <br>

| Goal # | Description | Date 
| --- | --- | --- | 
|  1 | Requirement Analysis | <b>August 14- August 30 </b> |
| 2 | Planning | August 14-August 30 |
|  3 | Architectural Design | September 11 - September 15 |
|  4.1 | Development Phase | September 16 - November 19 |
|  4.2 | Front-End Development| September 16 - End of Month |
|  4.3 | Back-End Development |October 1 - October 31 |
|  4.4 | Database Deployment | October 1 - October 31 |
|  5 | Debugging and Testing| <b> TBA </b> |
|  6 | Documentation and Deployment | <b> TBA  </b> |

