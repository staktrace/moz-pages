/*
  var uvOptions = {};
  (function() {
    var uv = document.createElement('script'); uv.type = 'text/javascript'; uv.async = true;
    uv.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'widget.uservoice.com/b8ZJ8qbtk51uyB48CKDWZA.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(uv, s);
  })();

*/
(function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/5LgcZMvtMrCuFEahWjMxeA.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})()

UserVoice = window.UserVoice || [];

// Identify the user and pass traits
// To enable, replace sample data with actual user traits and uncomment the line
UserVoice.push(['identify',{
    email: 'demo@sandglaz.com', // User’s email address
    name: 'Demo', // User’s real name
    username: '', 
    id: '84151', // Optional: Unique id of the user (if set, this should not change)
    created_at: 1471457428, // Unix timestamp for the date the user signed up
    type: 'premium' // Optional: segment your users by type i.e. role

}]);

if ((typeof Sandglaz !== "undefined") && (typeof Sandglaz.in_app !== "undefined") && Sandglaz.in_app) {
  UserVoice.push(['addTrigger', '#uv_trigger', {mode: 'contact', target: '#toolbar_help'}]);
  UserVoice.push(['addTrigger', '#uv_smartvote_trigger', {mode: 'smartvote', target: '#toolbar_help'}]);
  UserVoice.push(['addTrigger', '#uv_satisfaction_trigger', {mode: 'satisfaction', target: '#toolbar_help'}]);
    // Autoprompt users for Satisfaction and SmartVote
    // (only displayed when certain conditions are met)
    UserVoice.push(['autoprompt', {}]); 
}