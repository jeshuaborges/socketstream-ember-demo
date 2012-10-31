/* QUICK CHAT DEMO */
window.Chat = Chat = Ember.Application.create();

Chat.Message = Ember.Object.extend({
  body: null,

  init: function() {
    this._super();

    this.set('createdAt', new Date());
  },

  send: function(cb) {
    cb = cb || $.noop;

    // Push message to socketstream server
    ss.rpc('demo.sendMessage', this.get('body'), cb);
  }
})

Chat.chatController = Ember.ArrayController.create({
  content: Ember.A([]),
  sending: false,

  sendCurrent: function() {
    var that    = this,
        body    = Chat.chatController.get('text'),
        message = Chat.Message.create({body: body});

    that.set('text', '');
    that.set('sending', true);

    message.send(function() {
      that.set('sending', false);
    });
  }
});

Chat.MainView = Ember.View.extend({
  tagName:      'form',
  templateName: 'chat-main',

  submit: function() {
    Chat.chatController.sendCurrent();

    return false;
  }
});

Chat.MessageView = Ember.View.extend({
  tagName: 'p',

  init: function() {
    this._super();

    var d = this.get('message.createdAt');

    this.set('timestamp', d.getHours() + ':' + this.pad2(d.getMinutes()) + ':' + this.pad2(d.getSeconds()))
  },

  didInsertElement: function() {
    $(this.get('element')).slideDown();
  },

  pad2: function(number) {
    return (number < 10 ? '0' : '') + number;
  }
});

// Extraneous demo on how ember binding makes life easy
Chat.MessageField = Ember.TextField.extend({
  attributeBindings:  ['placeholder'],
  sendingBinding:     'Chat.chatController.sending',

  placeholder: function() {
    return this.get('sending') ? 'Sending....' : 'Your message';
  }.property('sending')
})

// Listen out for newMessage events coming from the server
ss.event.on('newMessage', function(body) {
  var message = Chat.Message.create({body: body});

  Chat.chatController.pushObject(message);
});
