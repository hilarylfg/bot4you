import { Bot } from 'lucide-react'

export function LogoLoader({ minMs = 2000 }: { minMs?: number }) {
	return (
		<>
			<div
				id='logo-loader'
				className='logo-loader__wrapper'
				data-min-ms={minMs}
				aria-hidden='true'
			>
				<Bot className='logo-loader__logo' />
			</div>

			<script
				dangerouslySetInnerHTML={{
					__html: `
          (function () {
            var el = document.getElementById('logo-loader');
            if (!el) return;

            var min = parseInt(el.getAttribute('data-min-ms') || '2000', 10);
            var minDone = false, ready = false;

            function tryHide() {
              if (minDone && ready) {
                el.setAttribute('data-hide', '1');
                el.addEventListener('transitionend', function () {
                  if (el && el.parentNode) el.parentNode.removeChild(el);
                }, { once: true });
              }
            }

            setTimeout(function () { minDone = true; tryHide(); }, min);
            function markReady() { ready = true; tryHide(); }

            if (document.readyState === 'complete') {
              markReady();
            } else {
              window.addEventListener('load', markReady, { once: true });
            }
          })();
        `
				}}
			/>
		</>
	)
}
