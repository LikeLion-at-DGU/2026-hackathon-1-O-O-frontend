import React, { useEffect, useState } from "react";
import { getReport } from "../api/reports";

export default function AnalyticsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const loadReport = async () => {
      //  테스트용
      const visitId = sessionStorage.getItem("visit_id");

    if (!visitId) {
    console.log("❌ visit_id 없음");
    return;
    }

      const response = await getReport(visitId);

      console.log("📊 리포트:", response.data);

      setReport(response.data);
    };

    loadReport();
  }, []);

  if (!report) {
    return <div>리포트 불러오는 중...</div>;
  }

  return (
    <div>
      <h1>방문 리포트</h1>

      <h2>요약</h2>

      <p>
        상품 조회: {report.summary.total_views}회
      </p>

      <p>
        상품 클릭: {report.summary.total_clicks}회
      </p>

      <p>
        질문: {report.summary.total_questions}회
      </p>

      <h2>가장 관심 있는 상품</h2>

      {report.most_interested_product ? (
        <div>
          <p>
            상품 ID: {report.most_interested_product.product_id}
          </p>

          <p>
            관심도: {report.most_interested_product.score}
          </p>

          <p>
            조회수: {report.most_interested_product.views}
          </p>

          <p>
            클릭수: {report.most_interested_product.clicks}
          </p>

          <p>
            질문:{" "}
            {report.most_interested_product.questions.join(", ")}
          </p>
        </div>
      ) : (
        <p>관심 상품이 없습니다.</p>
      )}

      <h2>상품별 관심도</h2>

      {report.products.map((product) => (
        <div key={product.product_id}>
          <p>
            {product.product_id} : {product.score}점
          </p>
        </div>
      ))}
    </div>
  );
}