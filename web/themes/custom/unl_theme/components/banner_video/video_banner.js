(function (Drupal) {
  Drupal.behaviors.unlVideoBanner = {
    attach: function (context) {
      const banners = context.querySelectorAll('.unl-video-banner:not(.js-processed)');
      
      banners.forEach(banner => {
        banner.classList.add('js-processed');
        const playBtn = banner.querySelector('.unl-video-banner__play');
        
        if (playBtn) {
          playBtn.addEventListener('click', function (e) {
            e.preventDefault(); 
            const url = this.getAttribute('href');
            
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            
            if (match && match[2].length === 11) {
              const videoId = match[2];
              
              const iframe = document.createElement('iframe');
              iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
              iframe.setAttribute('frameborder', '0');
              iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
              iframe.setAttribute('allowfullscreen', '1');
              iframe.classList.add('unl-video-banner__iframe');
              
              banner.appendChild(iframe);
              banner.querySelector('.unl-video-banner__bg').style.opacity = '0';
              
              const footer = banner.querySelector('.unl-video-banner__footer');
              if (footer) footer.style.opacity = '0';
              
              this.style.display = 'none'; 
            } else {
              window.open(url, '_blank');
            }
          });
        }
      });
    }
  };
})(Drupal);