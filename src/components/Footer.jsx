import logo from "../assets/logo.png";
import iconDiscord from "../assets/social/i-discord.svg";
import iconFacebook from "../assets/social/i-facebook.svg";
import iconInstagram from "../assets/social/i-instagram.svg";
import iconTelegram from "../assets/social/i-telegram.svg";
import iconTwitter from "../assets/social/i-twitter.svg";
import iconYoutube from "../assets/social/i-youtube.svg";
import iconFooterTop from "../assets/footer-to-top.svg";

function Footer() {
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<footer>
			<div className="flex flex-wrap justify-between items-center">
				<img src={logo} className="footer-logo mobile" alt="Creo Engine Logo" />
				<img src={iconFooterTop} className="icon-footer-to-top mobile" alt="icon-footer-to-top" onClick={scrollToTop} />
			</div>
			<p className="footer-copyright mobile">
				© 2022 Creoplay. All rights reserved. All trademarks are property of their respective owners in the US and other countries. VAT included in all prices where applicable.
			</p>
			<ul className="footer-nav mobile">
				<li className="item">
					<a href="https://creoplay.app/termsofservice" className="link" target="_blank" rel="noreferrer">
						Terms of Service
					</a>
				</li>
				<li className="item">
					<a href="https://creoplay.app/privacy" className="link" target="_blank" rel="noreferrer">
						Privacy Policy
					</a>
				</li>
				<li className="item">
					<a href="https://discord.gg/creoengine" className="link" target="_blank" rel="noreferrer">
						Support
					</a>
				</li>
			</ul>
			<div className="flex flex-wrap items-center justify-between">
				<div className="flex flex-wrap items-center gap-8">
					<a href="https://discord.com/invite/creoengine" target="_blank" rel="noreferrer">
						<img src={iconDiscord} className="icon-footer-social" alt="icon-discord" />
					</a>
					<a href="https://facebook.com/CreoEngineGlobal/" target="_blank" rel="noreferrer">
						<img src={iconFacebook} className="icon-footer-social" alt="icon-facebook" />
					</a>
					<a href="https://instagram.com/creoengine.official/" target="_blank" rel="noreferrer">
						<img src={iconInstagram} className="icon-footer-social" alt="icon-instagram" />
					</a>
					<a href="https://t.me/CreoEngineChannel" target="_blank" rel="noreferrer">
						<img src={iconTelegram} className="icon-footer-social" alt="icon-telegram" />
					</a>
					<a href="https://twitter.com/creo_engine" target="_blank" rel="noreferrer">
						<img src={iconTwitter} className="icon-footer-social" alt="icon-twitter" />
					</a>
					<a href="https://youtube.com/channel/UCiYbgRVmXNbX7iB9q_9sleA" target="_blank" rel="noreferrer">
						<img src={iconYoutube} className="icon-footer-social" alt="icon-youtube" />
					</a>
				</div>
				<img src={iconFooterTop} className="icon-footer-to-top cursor-pointer" alt="icon-footer-to-top" onClick={scrollToTop} />
			</div>
			<p className="footer-copyright">
				© 2022 Creoplay. All rights reserved. All trademarks are property of their respective owners in the US and other countries. VAT included in all prices where applicable.
			</p>
			<div className="footer-link-box">
				<div className="flex flex-wrap items-center justify-between">
					<ul className="flex flex-wrap items-center">
						<li className="item">
							<a href="https://creoplay.app/termsofservice" className="link" target="_blank" rel="noreferrer">
								Terms of Service
							</a>
						</li>
						<li className="item">
							<a href="https://creoplay.app/privacy" className="link" target="_blank" rel="noreferrer">
								Privacy Policy
							</a>
						</li>
						<li className="item">
							<a href="https://discord.gg/creoengine" className="link" target="_blank" rel="noreferrer">
								Support
							</a>
						</li>
					</ul>
					<img src={logo} className="footer-logo" alt="Creo Engine Logo" />
				</div>
			</div>
		</footer>
	);
}

export default Footer;
