export default function VideoBackground() {
  return (
    <div className="video-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-content"
      >
        <source src="/job html.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>
    </div>
  );
}
