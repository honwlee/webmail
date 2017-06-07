webmail
========

a mail delivery platform for incoming & outgoing e-mail


```sh  
$ git clone https://github.com/honwlee/webmail.git 
$ cd webmail  
$ npm start
$ npm server  
```  
## API
* MAILS
  * [GET]: api/webmail/mails/:id
  * [POST]: api/webmail/mails
  * [POST]: api/webmail/mails/mark
  * [DELETE]: api/webmail/mails/:id
* ACCOUNTS
  * [GET]: api/webmail/accounts
  * [POST]: api/webmail/accounts/:id/refresh
  * [DELETE]: api/webmail/accounts/:id/mails/empty
  * [POST]: api/webmail/accounts/:id/mail/send
  * [POST]: api/webmail/accounts/mails
  * [POST]: api/webmail/accounts/add
  * [POST]: api/webmail/accounts/:id
  * [DELETE]: api/webmail/accounts/:id

## Reference
[nodeMailer](https://github.com/andris9/Nodemailer)  
[mail-notifier](https://github.com/jcreigno/nodejs-mail-notifier.git)  
[poplib](https://github.com/ditesh/node-poplib.git) 
[mailparser](https://github.com/andris9/mailparser)  
[node-email-templates](https://github.com/niftylettuce/node-email-templates)
[passport](https://github.com/jaredhanson/passport.git)
[mongoose](https://github.com/Automattic/mongoose.git)


## License 

(The MIT License)

Copyright (c) 2012 nomospace

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
