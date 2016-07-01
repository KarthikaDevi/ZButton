ember-cli-zbutton

  An ember-addon for button component that enhances the standard form elements like buttons,inputs and anchors by applying visual theme to them.

Usage

Normal Button

    {{ #z-button }} Normal Button {{/z-button}}
   
Primary Button 

    {{ #z-button data-style="primary" }} Primary Button {{z-button}}
    
Icon Only Button

    {{ #z-button data-icon="spriteIconClass" }}{{/z-button}}
    
Icon Text Button

    {{ #z-button data-icon="spriteIconClass" }} Icon Text Button {{/z-button}}
    
    data-icon supports svg icon also. Format to provide svg icon is as follows
    
    data-icon = "#svg-id class-name"
    
Buttons with various sizes

    {{ #z-button data-size="large" }} Large Button {{/z-button}}
    
    Values of size may be "large", "small" and "mini"

Buttons with disabled state

    {{#z-button disabled="true" }} Disabled Button {{/z-button}}
    

Installation

        ember install git+https://github.com/KarthikaDevi/ZButton.git
    
Running the Server

        ember server
    
    Visit your app at http://localhost:4200.

Building

        ember build
    
For more information on using ember-cli, visit http://www.ember-cli.com/.
