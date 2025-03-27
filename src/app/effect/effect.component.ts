import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-effect',
  templateUrl: './effect.component.html',
  styleUrls: ['./effect.component.css']
})
export class EffectComponent implements AfterViewInit {

  @ViewChild('testTube') testTube!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  @ViewChild('text1') text1!: ElementRef;
  @ViewChild('text2') text2!: ElementRef;
  @ViewChild('text3') text3!: ElementRef;
  @ViewChild('text4') text4!: ElementRef;
  @ViewChild('text5') text5!: ElementRef;
  @ViewChild('text6') text6!: ElementRef;
  @ViewChild('endText') endText!: ElementRef;

  ngAfterViewInit(): void {
    // Reset initial state
    gsap.set(this.testTube.nativeElement, {
      opacity: 0,
      width: 0,
      height: 0
    });

    gsap.set(this.endText.nativeElement, {
      opacity: 0,
      scale: 0.5
    });

    // Master timeline for smooth sequencing
    const master = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2, // Slower scrub for smoother effect
        pin: false,
        markers: false
      }
    });

    /* ========= SHAPE ANIMATION ========= */
    // 1. Dot appearance (0-5%)
    master.to(this.testTube.nativeElement, {
      opacity: 1,
      width: 10,
      height: 10,
      duration: 2,
      ease: "sine.out"
    }, "0%");

    // 2. Grow to circle (5-15%)
    master.to(this.testTube.nativeElement, {
      width: 80,
      height: 80,
      borderRadius: "40px",
      boxShadow: "0 0 25px rgba(255, 138, 0, 0.8)",
      duration: 4,
      ease: "sine.inOut",
      filter: "brightness(1.3)"
    }, "5%");

    // 3. Expand to pill shape (15-30%)
    master.to(this.testTube.nativeElement, {
      width: "70vw",
      height: 100,
      borderRadius: "50px",
      boxShadow: "0 0 50px rgba(255, 138, 0, 0.9)",
      duration: 6,
      ease: "power2.inOut",
      filter: "brightness(1.6)"
    }, "15%");

    // Show text container
    master.to(".text-container", {
      opacity: 1,
      duration: 2
    }, "15%");

    /* ========= TEXT ANIMATION ========= */
    const textElements = [
      this.text1, this.text2, this.text3, 
      this.text4, this.text5, this.text6
    ].map(t => t.nativeElement);

    // Forward animations
    textElements.forEach((text, i) => {
      const position = 20 + (i * 10); // Stagger positions
      
      // Text entry
      master.fromTo(text, 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 4, 
          ease: "back.out(1.2)" 
        }, 
        `${position}%`
      );
    });

    // Reverse animations (texts disappear in reverse order)
    textElements.slice().reverse().forEach((text, i) => {
      const position = 70 - (i * 10); // Stagger positions in reverse
      
      // Text exit
      master.to(text, 
        { 
          y: -40, 
          opacity: 0, 
          duration: 4, 
          ease: "sine.in" 
        }, 
        `${position}%`
      );
    });

    /* ========= SHAPE REVERSE ANIMATION ========= */
    // After last text (around 80%)
    master.to(this.testTube.nativeElement, {
      width: "60vw",
      boxShadow: "0 0 70px rgba(255, 138, 0, 1)",
      filter: "brightness(2)",
      duration: 4
    }, "80%");

    // Shrink back to circle (85-90%)
    master.to(this.testTube.nativeElement, {
      width: 80,
      height: 80,
      borderRadius: "40px",
      boxShadow: "0 0 30px rgba(255, 138, 0, 0.8)",
      duration: 3,
      ease: "power2.in"
    }, "85%");

    // Show "THE END" text
    master.to(this.endText.nativeElement, {
      opacity: 1,
      scale: 1,
      duration: 3,
      ease: "elastic.out(1, 0.5)"
    }, "90%");

    // Final shrink to dot (95-100%)
    master.to(this.testTube.nativeElement, {
      width: 10,
      height: 10,
      borderRadius: "50%",
      opacity: 0,
      duration: 3,
      ease: "power2.out"
    }, "95%");

    // Hide "THE END" text at the very end
    master.to(this.endText.nativeElement, {
      opacity: 0,
      scale: 0.5,
      duration: 2,
      ease: "power2.in"
    }, "98%");
  }
}