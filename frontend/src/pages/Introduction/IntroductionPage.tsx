import FloatingButtons from "../../components/FloatingButton/FloatingButtons.tsx";
import Footer from "../../components/Footer/Footer.tsx";
import CustomerNavbar from "../../components/Navbar/CustomerNavbar/CustomerNavbar.tsx";
import React from "react"
import {Link} from "react-router-dom";
import "./Introduction.scss"

const IntroductionPage: React.FC = () => {
    return (
      <>
        <CustomerNavbar/>
          <>
              <div className="introductionContainer">
                <span>
                    <Link style={{textDecoration: "none", color: "#2A388F"}} to="/homepage">Trang chủ</Link><span
                    className="separator"> » </span><span
                    className="last">Giới thiệu</span>
                </span>

                  <div style={{paddingTop: "20px"}} className="introductionTitle">
                      <h1 className="gt-title">Giới thiệu</h1>
                  </div>

                  <p style={{textAlign: "center", paddingBottom: "10px"}}>
                    <span style={{color: "#000080", fontSize: "14pt"}}>
                        <strong>SIDE_EFFECT - TIÊN PHONG TRONG DỊCH VỤ TIÊM CHỦNG TRẺ EM</strong>
                    </span><br/>
                      <span style={{color: "#000080", fontSize: "14pt"}}><strong>AN TOÀN, UY TÍN, CHẤT LƯỢNG ĐƯỢC HÀNG CHỤC TRIỆU GIA ĐÌNH TIN TƯỞNG LỰA CHỌN!</strong></span>
                  </p>

                  <p className="introductionText">Trong suốt nhiều thập kỷ, tiêm chủng đã trở thành một trong những bước
                      tiến quan trọng nhất của y học hiện đại, giúp bảo vệ hàng triệu trẻ em khỏi các bệnh truyền nhiễm
                      nguy hiểm. Tuy nhiên, việc tiêm chủng không chỉ đơn giản là đưa trẻ đến cơ sở y tế và thực hiện một
                      mũi tiêm. Đó là cả một quá trình dài, đòi hỏi sự theo dõi sát sao, quản lý chặt chẽ và hiểu biết đầy
                      đủ về từng loại vắc-xin, lịch trình tiêm, cũng như phản ứng sau tiêm của từng bé.
                  </p>

                  <p className="introductionText">
                      Nhiều bậc phụ huynh mong muốn con mình được tiêm chủng đúng lịch, nhưng họ lại gặp nhiều khó khăn
                      trong việc theo dõi và ghi nhớ các mũi tiêm quan trọng. Một số lo ngại về tác dụng phụ, trong khi
                      những người khác lại không biết nên lựa chọn loại vắc-xin nào cho phù hợp với thể trạng của con
                      mình. Đôi khi, việc đặt lịch tiêm cũng trở thành một trở ngại, bởi sự chênh lệch thời gian giữa phụ
                      huynh và cơ sở y tế, cũng như sự quá tải của các trung tâm tiêm chủng lớn.
                  </p>

                  <p className="introductionText">
                      Side_Effect ra đời để giải quyết tất cả những vấn đề này bằng cách kết hợp y học hiện đại với công
                      nghệ tiên tiến, tạo ra một hệ sinh thái tiêm chủng thông minh, an toàn và thuận tiện nhất cho phụ
                      huynh và trẻ nhỏ. Với sứ mệnh nâng cao chất lượng tiêm chủng và tối ưu hóa trải nghiệm của khách
                      hàng, chúng tôi không chỉ cung cấp dịch vụ tiêm chủng mà còn đem đến một giải pháp toàn diện giúp
                      các bậc cha mẹ yên tâm hơn trong hành trình chăm sóc sức khỏe con trẻ.
                  </p>

                  <p style={{textAlign: "center", paddingBottom: "10px"}}>
                      <img decoding="async"
                           src="https://th.bing.com/th/id/OIP.rtOJaLcOP6mZmLWcR6Z6wgHaD4?rs=1&pid=ImgDetMain"
                           alt="vnvc có mặt tại 55 tỉnh thành"/>
                  </p>

                  <h2><b style={{color: "#2a388f", fontSize: "30px"}}>1. Dẫn Đầu Trong Công Nghệ Tiêm Chủng Cho Trẻ</b>
                  </h2>

                  <p className="introductionText">
                      Side_Effect không chỉ là một cơ sở tiêm chủng đơn thuần mà còn là một hệ sinh thái y tế thông minh,
                      tiên phong trong việc số hóa và hiện đại hóa quy trình tiêm chủng. Với sự kết hợp giữa công nghệ dữ
                      liệu lớn (Big Data), trí tuệ nhân tạo (AI) và hồ sơ sức khỏe điện tử (EHR), chúng tôi mang đến một
                      hệ thống quản lý tiêm chủng toàn diện, giúp tối ưu hóa trải nghiệm của khách hàng từ khâu đăng ký,
                      theo dõi lịch trình đến giám sát sức khỏe sau tiêm.
                  </p>

                  <p className="introductionText">
                      Một trong những điểm đột phá của hệ thống Side_Effect chính là việc tích hợp công nghệ nhận diện
                      khuôn mặt và mã QR vào quá trình tiếp nhận bệnh nhân. Khi đến cơ sở, thay vì phải làm thủ tục rườm
                      rà, phụ huynh chỉ cần quét mã QR để truy cập hồ sơ tiêm chủng của con, cập nhật thông tin sức khỏe
                      và nhận hướng dẫn chi tiết về quy trình tiêm. Điều này không chỉ giúp rút ngắn đáng kể thời gian chờ
                      đợi mà còn đảm bảo tính chính xác trong khâu tiếp nhận thông tin, hạn chế tối đa sai sót do nhập
                      liệu thủ công. Hơn nữa, hệ thống này còn giúp đội ngũ y bác sĩ có thể nhanh chóng truy xuất dữ liệu
                      y tế, từ đó đưa ra quyết định kịp thời và phù hợp nhất với từng trường hợp.
                  </p>

                  <p className="introductionText">
                      Thay vì phải ghi nhớ lịch tiêm phức tạp hoặc loay hoay với các giấy tờ y tế truyền thống, mỗi trẻ em
                      khi đăng ký tại Side_Effect sẽ được cấp một hồ sơ sức khỏe điện tử cá nhân. Hệ thống này ghi lại
                      toàn bộ thông tin quan trọng bao gồm tiền sử miễn dịch, các mũi vắc-xin đã được tiêm, phản ứng sau
                      tiêm, cũng như các yếu tố rủi ro liên quan đến sức khỏe của bé. Nhờ vào sự hỗ trợ của AI, dữ liệu
                      này không chỉ được lưu trữ an toàn mà còn được phân tích liên tục để đưa ra các khuyến nghị tiêm
                      chủng chính xác, cá nhân hóa theo tình trạng sức khỏe của từng trẻ. Phụ huynh sẽ nhận được thông báo
                      kịp thời về các mũi tiêm tiếp theo, những lưu ý quan trọng trước và sau tiêm, đồng thời có thể dễ
                      dàng kiểm tra hồ sơ sức khỏe của con chỉ với vài thao tác trên ứng dụng.
                  </p>

                  <p className="introductionText">
                      Bằng cách ứng dụng những công nghệ tiên tiến nhất vào lĩnh vực tiêm chủng, Side_Effect không chỉ
                      giúp nâng cao hiệu quả bảo vệ sức khỏe cộng đồng mà còn mang đến sự tiện lợi, an toàn và minh bạch
                      trong toàn bộ quá trình tiêm chủng. Chúng tôi cam kết đồng hành cùng các bậc phụ huynh trong hành
                      trình bảo vệ sức khỏe cho con em mình, đảm bảo rằng mỗi mũi tiêm không chỉ là một biện pháp phòng
                      bệnh mà còn là một bước tiến quan trọng trong việc xây dựng một hệ thống y tế thông minh và bền
                      vững.
                  </p>

                  <h2>
                      <b style={{color: "#2a388f", fontSize: "30px"}}>
                          2. Quy Trình Tiêm Chủng Khép Kín – An Toàn Tuyệt Đối
                      </b>
                  </h2>

                  <p className="introductionText">
                      Sự an toàn của trẻ em luôn là ưu tiên hàng đầu tại Side_Effect. Chính vì vậy, toàn bộ quy trình tiêm
                      chủng tại đây đều được thiết kế theo tiêu chuẩn nghiêm ngặt của Tổ chức Y tế Thế giới (WHO) và Bộ Y
                      tế, đảm bảo rằng mỗi mũi tiêm đều được thực hiện với độ chính xác và chất lượng cao nhất.
                  </p>


                  <p className="introductionText">
                      Trước khi tiêm, bé sẽ được các bác sĩ sàng lọc sức khỏe kỹ lưỡng để đánh giá xem có đủ điều kiện
                      tiêm chủng hay không. Những yếu tố như tiền sử dị ứng, các bệnh lý nền hay phản ứng miễn dịch của cơ
                      thể sẽ được xem xét cẩn thận để đưa ra quyết định phù hợp.
                  </p>

                  <p className="introductionText">
                      Tất cả vắc-xin tại Side_Effect đều được bảo quản trong hệ thống dây chuyền lạnh hiện đại, với nhiệt
                      độ được giám sát tự động để đảm bảo chất lượng luôn ở mức tối ưu. Việc vận chuyển, lưu trữ và sử
                      dụng vắc-xin được thực hiện theo quy trình chặt chẽ, giúp duy trì hiệu quả miễn dịch của từng loại
                      vắc-xin và giảm thiểu nguy cơ xảy ra tác dụng phụ không mong muốn.
                  </p>

                  <p className="introductionText">
                      Sau khi tiêm, phụ huynh sẽ nhận được hướng dẫn chi tiết về cách theo dõi trẻ tại nhà, nhận diện các
                      dấu hiệu bất thường và khi nào cần đưa trẻ quay lại cơ sở y tế. Hệ thống nhắc lịch tự động của
                      Side_Effect sẽ gửi thông báo về các mũi tiêm tiếp theo, giúp phụ huynh không bỏ lỡ bất kỳ mũi tiêm
                      quan trọng nào. Nếu trẻ có phản ứng sau tiêm, phụ huynh có thể ghi nhận trực tiếp trên hệ thống để
                      nhận được sự hỗ trợ kịp thời từ đội ngũ bác sĩ.
                  </p>

                  <figure id="attachment_77882" aria-describedby="caption-attachment-77882"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-77882"
                                                                  src="https://homelandprepnews.com/wp-content/uploads/2018/07/shutterstock_170652599.jpg"
                                                                  alt="vnvc luôn cung ứng đầy đủ vắc xin" width="800"
                                                                  height="532"/>
                      <figcaption id="caption-attachment-77882" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>Side Effect cam kết cung ứng đầy đủ
                          vắc xin cho trẻ em và người lớn chất lượng cao, nhập khẩu chính hãng từ các nhà sản xuất vắc xin
                          hàng đầu Thế giới
                      </figcaption>
                  </figure>

                  <h2><b style={{color: "#2a388f", fontSize: "30px"}}>3. Dịch Vụ Tiêm Chủng Linh Hoạt – Cá Nhân Hóa Theo
                      Nhu Cầu</b></h2>

                  <p className="introductionText">
                      Side_Effect mang đến nhiều gói dịch vụ tiêm chủng linh hoạt, phù hợp với nhu cầu đa dạng của các gia
                      đình. Phụ huynh có thể lựa chọn tiêm lẻ từng mũi theo nhu cầu, đăng ký gói tiêm chủng trọn gói với
                      lịch trình đầy đủ từ sơ sinh đến trưởng thành, hoặc cá thể hóa lộ trình tiêm theo tình trạng sức
                      khỏe và đặc điểm miễn dịch riêng của từng bé. Đối với những trẻ có tiền sử dị ứng, phản ứng sau tiêm
                      hoặc cần theo dõi đặc biệt, hệ thống sẽ tự động đề xuất phác đồ tiêm phù hợp, đảm bảo an toàn tối đa
                      trong suốt quá trình tiêm chủng.
                  </p>

                  <p className="introductionText">
                      Hệ thống đặt lịch trực tuyến được thiết kế để giúp phụ huynh dễ dàng quản lý việc tiêm chủng cho con
                      mà không cần mất thời gian đến trực tiếp cơ sở. Chỉ với vài thao tác trên ứng dụng, phụ huynh có thể
                      lựa chọn ngày giờ tiêm phù hợp, thay đổi lịch hẹn linh hoạt hoặc hủy lịch khi có nhu cầu. Thông tin
                      chi tiết về loại vắc-xin, hướng dẫn trước và sau tiêm, cũng như quy trình tiêm chủng đều được cập
                      nhật minh bạch trên hệ thống. Bên cạnh đó, Side_Effect còn tích hợp công nghệ nhắc lịch tự động, gửi
                      thông báo qua điện thoại và email để đảm bảo phụ huynh không bỏ lỡ bất kỳ mũi tiêm quan trọng nào.
                  </p>

                  <p className="introductionText">
                      Với sự kết hợp giữa công nghệ và dịch vụ y tế, Side_Effect không chỉ mang đến sự tiện lợi trong quá
                      trình đặt lịch mà còn giúp chuẩn hóa và tối ưu hóa toàn bộ quy trình tiêm chủng, đảm bảo mỗi trẻ đều
                      được chăm sóc và bảo vệ một cách toàn diện.
                  </p>

                  <figure id="attachment_78526" aria-describedby="caption-attachment-78526"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="wp-image-78526 size-full"
                                                                  src="https://th.bing.com/th/id/R.14784a25136a21e476b1284d2860db57?rik=1X9mTJSVExc%2biA&pid=ImgRaw&r=0"
                                                                  alt="kho lạnh bảo quản vắc xin của vnvc" width="800"
                                                                  height="534"/>
                      <figcaption id="caption-attachment-78526" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>Hệ thống kho bảo quản vắc xin
                          đạt chuẩn đảm bảo lưu trữ và bảo quản các loại vắc xin trong điều kiện tối ưu từ
                          2-8 độ C
                      </figcaption>
                  </figure>
                  <figure id="attachment_78268" aria-describedby="caption-attachment-78268"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="wp-image-78268 size-full"
                                                                  src="https://www.rpsins.com/-/media/images/rpsins/rpsins/aa_2024_listing-images/46010-rps-us-2024-rpsinscom-oo-1280x720lpgfinal/1200x627.jpg"
                                                                  alt="hệ thống kho lạnh vận chuyển vắc xin" width="800"
                                                                  height="534"/>
                      <figcaption id="caption-attachment-78268" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>Hệ thống hơn 30 xe
                          lạnh chuyên dụng vận chuyển vắc xin, chủ động vận chuyển và cấp phát vắc xin an toàn đến các
                          trung tâm trên toàn quốc
                      </figcaption>
                  </figure>
                  <figure id="attachment_77895" aria-describedby="caption-attachment-77895"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-77895"
                                                                  src="https://th.bing.com/th/id/OIP.i5PKQjpqwLCeJMcWIzS3MQHaE7?rs=1&pid=ImgDetMain"
                                                                  alt="tủ lạnh bảo quản vắc xin chuyên dụng" width="800"
                                                                  height="534"/>
                      <figcaption id="caption-attachment-77895" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>100% phòng tiêm được
                          trang bị tủ bảo quản vắc xin chuyên dụng, vắc xin cuối ngày sẽ được hoàn về kho tổng để bảo quản
                          theo tiêu chuẩn GSP
                      </figcaption>
                  </figure>

                  <h2><b style={{color: "#2a388f", fontSize: "30px"}}>4. Đội Ngũ Chuyên Gia Hàng Đầu – Cam Kết Vì Sức Khỏe
                      Trẻ Em</b></h2>

                  <p className="introductionText">
                      Sự thành công của Side_Effect không chỉ đến từ nền tảng công nghệ tiên tiến mà còn được xây dựng
                      trên nền tảng vững chắc của một đội ngũ y bác sĩ và chuyên gia y tế hàng đầu. Các bác sĩ tại
                      Side_Effect không chỉ là những chuyên gia giàu kinh nghiệm trong lĩnh vực miễn dịch học và nhi khoa
                      mà còn được đào tạo bài bản về quy trình tiêm chủng an toàn, đảm bảo mỗi mũi tiêm đều đạt tiêu chuẩn
                      cao nhất về hiệu quả và độ an toàn. Chúng tôi đặc biệt chú trọng đến việc cập nhật liên tục các
                      nghiên cứu mới nhất trong lĩnh vực vắc-xin và miễn dịch, giúp đội ngũ y tế luôn sẵn sàng đưa ra
                      những tư vấn chính xác, khoa học và phù hợp nhất với từng trường hợp cụ thể.
                  </p>

                  <p className="introductionText">
                      Không chỉ có đội ngũ chuyên môn xuất sắc, Side_Effect còn sở hữu một hệ thống chăm sóc khách hàng
                      chuyên nghiệp, hoạt động 24/7 để mang đến sự hỗ trợ kịp thời và tận tình cho mọi gia đình. Mọi thắc
                      mắc về lịch tiêm, thành phần vắc-xin, phản ứng sau tiêm hay những lưu ý trước khi tiêm đều được giải
                      đáp nhanh chóng qua tổng đài tư vấn, hệ thống chat trực tuyến hoặc ứng dụng di động. Đặc biệt, với
                      những trường hợp trẻ có phản ứng sau tiêm, đội ngũ y tế luôn sẵn sàng tư vấn và hướng dẫn cách xử lý
                      phù hợp để đảm bảo an toàn tối đa.
                  </p>

                  <p className="introductionText">
                      Không chỉ dừng lại ở việc cung cấp dịch vụ tiêm chủng, Side_Effect còn nỗ lực xây dựng một môi
                      trường chăm sóc sức khỏe toàn diện, nơi phụ huynh luôn cảm thấy an tâm và tin tưởng tuyệt đối khi
                      lựa chọn dịch vụ. Sự hài lòng của khách hàng không chỉ là mục tiêu mà còn là kim chỉ nam trong mọi
                      hoạt động của chúng tôi.
                  </p>

                  <figure id="attachment_78525" aria-describedby="caption-attachment-78525"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-78525"
                                                                  src="https://post.healthline.com/wp-content/uploads/2021/03/Male_Covid_Vaccine_1296x728-header-1296x729.jpg"
                                                                  alt="khám sàng lọc trước tiêm chủng cho bé tại vnvc"
                                                                  width="800" height="534"/>
                      <figcaption id="caption-attachment-78525" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>Đội ngũ bác sĩ chuyên môn cao,
                          giàu kinh nghiệm tiến hành khám sàng lọc trước tiêm, tư vấn và chỉ định tiêm loại vắc xin phù
                          hợp, chính xác
                      </figcaption>
                  </figure>
                  <figure id="attachment_77903" aria-describedby="caption-attachment-77903"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="wp-image-77903 size-full"
                                                                  src="https://s3.amazonaws.com/cms.ipressroom.com/296/files/202110/202111031705/6182c15fb3aed3197bb0019c_Child+vaccinations+2021/Child+vaccinations+2021_1e96b43a-d3a8-400c-8cf0-bac9ea8ed372-prv.jpg"
                                                                  alt="kiểm tra thông tin trước tiêm chủng" width="800"
                                                                  height="534"/>
                      <figcaption id="caption-attachment-77903" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>Trước khi tiêm chủng, điều
                          dưỡng viên tại phòng tiêm sẽ tiến hành kiểm tra thông tin người được tiêm chủng, giới thiệu về
                          vắc xin để đảm bảo tính chính xác
                      </figcaption>
                  </figure>
                  <figure id="attachment_78527" aria-describedby="caption-attachment-78527"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-78527"
                                                                  src="https://img.freepik.com/premium-photo/medical-doctor-holds-vaccine-patient_255667-21474.jpg"
                                                                  alt="tiêm ngừa cho người lớn tại vnvc" width="800"
                                                                  height="534"/>
                      <figcaption id="caption-attachment-78527" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>Đội ngũ điều dưỡng viên được đào tạo chuyên môn nghiệp vụ chuyên sâu, thành thạo kỹ năng tiêm giảm đau, nhẹ nhàng,
                          tạo tâm lý thoải mái cho Khách hàng
                      </figcaption>
                  </figure>
                  <h2><b style={{color: "#2a388f", fontSize: "30px"}}>5. Thành Tựu Và Cam Kết</b></h2>
                  <p className="introductionText">
                      Hơn một triệu trẻ em đã được tiêm chủng an toàn tại Side_Effect, một con số không chỉ thể hiện sự
                      tin tưởng của hàng triệu bậc phụ huynh mà còn là minh chứng cho chất lượng dịch vụ và sự cam kết
                      tuyệt đối của chúng tôi đối với sức khỏe cộng đồng. Nhờ áp dụng các quy trình tiêm chủng nghiêm ngặt
                      cùng hệ thống giám sát chặt chẽ, tỷ lệ phản ứng nhẹ sau tiêm tại Side_Effect thấp hơn 30% so với mức
                      trung bình của ngành, giúp phụ huynh an tâm hơn khi đưa con em đến tiêm chủng.
                  </p>

                  <p className="introductionText">
                      Không chỉ đảm bảo an toàn, Side_Effect còn giúp giảm hơn 40% số trường hợp trẻ bỏ lỡ mũi tiêm quan
                      trọng nhờ vào hệ thống nhắc lịch tự động, hoạt động thông minh dựa trên dữ liệu hồ sơ sức khỏe điện
                      tử. Phụ huynh không cần phải ghi nhớ phức tạp hay lo lắng về việc bỏ sót lịch tiêm, vì hệ thống của
                      chúng tôi sẽ tự động gửi thông báo nhắc nhở kịp thời, đồng thời đề xuất lịch hẹn phù hợp nhất với
                      thời gian biểu của từng gia đình.
                  </p>

                  <p className="introductionText">
                      Với mục tiêu xây dựng một nền tảng tiêm chủng không chỉ thông minh mà còn an toàn và tiện lợi nhất,
                      Side_Effect cam kết không ngừng đổi mới, ứng dụng công nghệ tiên tiến để nâng cao trải nghiệm khách
                      hàng và tối ưu hóa chất lượng dịch vụ. Chúng tôi liên tục mở rộng phạm vi tiếp cận, hợp tác với các
                      tổ chức y tế uy tín nhằm đưa dịch vụ tiêm chủng tiêu chuẩn cao đến gần hơn với mọi gia đình. Bằng sự
                      tận tâm và cam kết không ngừng cải tiến, Side_Effect hướng tới một tương lai nơi mọi trẻ em đều được
                      bảo vệ tốt nhất trước các bệnh truyền nhiễm, giúp các bậc phụ huynh an tâm hơn trong hành trình chăm
                      sóc sức khỏe cho con em mình.
                  </p>

                  <figure id="attachment_77907" aria-describedby="caption-attachment-77907"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="wp-image-77907 size-full"
                                                                  src="https://th.bing.com/th/id/OIP.8sxD7pPsTv7tP9hFahxVEgHaC9?rs=1&pid=ImgDetMain"
                                                                  alt="đồng bào dân tộc tiêm chủng tại vnvc" width="800"
                                                                  height="600"/>
                      <figcaption id="caption-attachment-77907" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>Trung tâm tiêm chủng VNVC nỗ
                          lực đưa vắc xin về các địa phương vùng sâu vùng xa để nhiều người dân được tiếp cận với vắc xin
                          chất lượng cao, giá bình ổn
                      </figcaption>
                  </figure>

                  <h2><b style={{color: "#2a388f", fontSize: "30px"}}>6. Side_Effect – Nơi Mỗi Mũi Tiêm Là Một Cam Kết Bảo
                      Vệ Tương Lai</b></h2>
                  <p className="introductionText">
                      Tại Side_Effect, mỗi mũi tiêm không chỉ đơn thuần là một liều vắc-xin, mà còn là một bước tiến quan
                      trọng trong hành trình xây dựng nền tảng sức khỏe vững chắc cho trẻ. Chúng tôi không chỉ đảm bảo
                      rằng mỗi bé đều được tiêm chủng đầy đủ và đúng lịch, mà còn tận tâm đồng hành cùng phụ huynh, cung
                      cấp kiến thức và hỗ trợ cần thiết để họ có thể đưa ra những quyết định tốt nhất cho con mình.
                  </p>

                  <p className="introductionText">
                      Sự an tâm của phụ huynh chính là động lực để Side_Effect không ngừng cải tiến và nâng cao chất lượng
                      dịch vụ. Mỗi công nghệ được áp dụng, mỗi quy trình được tối ưu hóa, và mỗi bác sĩ tại Side_Effect
                      đều làm việc với mục tiêu chung: đảm bảo rằng từng trẻ nhỏ bước vào trung tâm tiêm chủng của chúng
                      tôi đều được chăm sóc tận tình, an toàn tuyệt đối và có trải nghiệm thoải mái nhất.
                  </p>

                  <p className="introductionText">
                      Hãy để Side_Effect trở thành người bạn đồng hành đáng tin cậy trên hành trình chăm sóc sức khỏe của
                      con bạn. Mỗi mũi tiêm tại Side_Effect không chỉ giúp bảo vệ trẻ trước những căn bệnh nguy hiểm, mà
                      còn mang đến sự an tâm trọn vẹn cho cả gia đình, giúp phụ huynh vững tin rằng con mình đang nhận
                      được sự bảo vệ tốt nhất từ những chuyên gia hàng đầu.
                  </p>

                  <figure id="attachment_77908" aria-describedby="caption-attachment-77908"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="size-full wp-image-77908"
                                                                  src="https://d2jx2rerrg6sh3.cloudfront.net/images/news/ImageForNews_717902_16563897845991062.jpg"
                                                                  alt="khu vực sảnh chờ tiêm vắc xin" width="800"
                                                                  height="534"/>
                      <figcaption id="caption-attachment-77908" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>VNVC đầu tư xây dựng không
                          gian sảnh chờ rộng rãi, thoáng mát, máy lạnh 2 chiều, hương thơm an toàn giúp Khách hàng thư
                          giãn, thoải mái trong thời gian chờ đợi
                      </figcaption>
                  </figure>


                  <figure id="attachment_77910" aria-describedby="caption-attachment-77910"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="wp-image-77910 size-full"
                                                                  src="https://www.clinicaladvisor.com/wp-content/uploads/sites/11/2023/05/RSV_Vaccine_G_1265740892.jpg"
                                                                  alt="khu vui chơi tại vnvc" width="800" height="534"/>
                      <figcaption id="caption-attachment-77910" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>Khu vực vui chơi trong trung
                          tâm rộng rãi, sạch sẽ, đồ chơi nhập khẩu cao cấp, sinh động, đảm bảo an toàn, được vệ sinh, khử
                          khuẩn nhiều lần trong ngày
                      </figcaption>
                  </figure>
                  <figure id="attachment_77912" aria-describedby="caption-attachment-77912"
                          style={{width: "800px", margin: "0 auto", textAlign: "center", paddingBottom: "10px"}}
                          className="wp-caption aligncenter"><img decoding="async" className="wp-image-77912 size-full"
                                                                  src="https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2021/10/9/vaccine-pfizer1-1633659760-width1200height800-1633793841782-16337938420091500516052.jpg"
                                                                  alt="khu vực thay tã miễn phí" width="800"
                                                                  height="533"/>
                      <figcaption id="caption-attachment-77912" className="wp-caption-text"
                                  style={{fontStyle: "italic", fontSize: "17px"}}>Hệ thống trung tâm tiêm chủng
                          VNVC miễn phí 100% bỉm tã cao cấp các loại, giúp mẹ và các bé có những trải nghiệm thoải mái như
                          tại nhà
                      </figcaption>
                  </figure>
              </div>
          </>
          <FloatingButtons/>
          <Footer/>
      </>
    );
}

export default IntroductionPage;


