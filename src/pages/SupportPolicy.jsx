import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import sanitizeHtml from "sanitize-html";
import bannerImg from "@/assets/bannerImg.png";
import "../styles/SupportPolicy.css";
import { getKeywords } from "@/api/Ai";

const isValidUrl = (url) => {
  try {
    new URL(url);
    return url.startsWith("http://") || url.startsWith("https://");
  } catch {
    return false;
  }
};

const truncate = (text, len) =>
  text?.length > len ? `${text.slice(0, len)}...` : text || "";

const categoryEndpoints = {
  전체: "/youth-policy/search",
  주거정책: "/youth-policy/search?lclsfNm=주거",
  교육정책: "/youth-policy/search?lclsfNm=교육",
  복지정책: "/youth-policy/search?lclsfNm=복지문화",
  일자리정책: "/youth-policy/search?lclsfNm=일자리",
};

const SupportPolicy = () => {
  const { isLoggedIn, refreshAccessToken } = useAuth();
  const location = useLocation();
  const topRef = useRef(null);
  const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("전체");
  const [error, setError] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [keywordError, setKeywordError] = useState(null);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(true);
  const [zoom] = useState(0.9);

  const categories = ["전체", "주거정책", "교육정책", "복지정책", "일자리정책"];
  const API_KEY = import.meta.env.VITE_API_KEY || "your-api-key-here"; 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lclsfNm = params.get("lclsfNm");
    console.log("Query param lclsfNm:", lclsfNm, "Current category:", category);
    if (lclsfNm) {
      const categoryMap = {
        주거: "주거정책",
        교육: "교육정책",
        복지문화: "복지정책",
        일자리: "일자리정책",
      };
      const newCategory = categoryMap[lclsfNm] || "전체";
      console.log("Setting category to:", newCategory);
      setCategory(newCategory);
    }
  }, [location.search]);

  const fetchKeywords = useCallback(async () => {
    try {
      setIsLoadingKeywords(true);
      const res = await getKeywords();
      const unique = [...new Set(res.data.filter(Boolean))];
      setKeywords(unique);
      setKeywordError(null);
    } catch (err) {
      setKeywords([]);
      setKeywordError(err.message || "키워드 조회 실패");
    } finally {
      setIsLoadingKeywords(false);
    }
  }, []);

  const fetchPolicies = useCallback(
    async (pageNum = 1, retry = true) => {
      const endpoint = categoryEndpoints[category] || "/youth-policy/search";
      const params = {
        page: pageNum,
        pageSize: 9,
        ...(searchTerm && { searchTerm }),
      };
      const headers = {
        accept: "application/json",
        "X-API-Key": API_KEY, // API 키 추가
        ...(isLoggedIn && {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }),
      };

      try {
        console.log(
          "Fetching policies from:",
          `${import.meta.env.VITE_APP_API_URL}${endpoint}`,
          "Params:",
          params
        );
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}${endpoint}`,
          {
            params,
            headers,
            timeout: 10000,
          }
        );
        console.log("Policies response:", res.data);
        setPolicies(res.data.items || []);
        setTotalPages(Math.min(res.data.meta?.totalPages || 1, 100));
        setError(null);
      } catch (err) {
        console.error(
          "Failed to fetch policies:",
          err.message,
          err.response?.data
        );
        if (err.response?.status === 401 && isLoggedIn && retry) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            localStorage.setItem("accessToken", newToken);
            return fetchPolicies(pageNum, false); // 재시도
          }
        }
        setPolicies([]);
        setError(
          err.response?.data?.message ||
            err.message ||
            "정책 데이터를 불러오지 못했습니다."
        );
      }
    },
    [searchTerm, category, isLoggedIn, refreshAccessToken, API_KEY]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoadingKeywords(false);
      setKeywords([]);
      return;
    }
    fetchKeywords();
  }, [isLoggedIn, fetchKeywords]);

  useEffect(() => {
    fetchPolicies(page);
  }, [page, category, searchTerm, fetchPolicies]);

  useEffect(() => {
    console.log(
      "Keywords state updated:",
      keywords,
      "Length:",
      keywords.length
    );
  }, [keywords]);

  useEffect(() => {
    console.log("isLoadingKeywords state:", isLoadingKeywords);
  }, [isLoadingKeywords]);

  const handleCategoryClick = (cat) => {
    console.log("Category clicked:", cat);
    setCategory(cat);
    setSearchTerm("");
    setPage(1);
    fetchPolicies(1);
  };

  const handleTagClick = (tag) => {
    console.log("Tag clicked:", tag);
    setSearchTerm(tag.replace("#", ""));
    setCategory("전체");
    setPage(1);
    fetchPolicies(1);
  };

  const handleKeywordClick = (keyword) => {
    console.log("Keyword clicked:", keyword);
    setSearchTerm(keyword);
    setCategory("전체");
    setPage(1);
    fetchPolicies(1);
  };

  const handlePolicyViewClick = (policy) => {
    console.log("Policy view clicked:", policy.plcyNm);
    if (policy.refUrlAddr1 && isValidUrl(policy.refUrlAddr1)) {
      window.open(policy.refUrlAddr1, "_blank", "noopener,noreferrer");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      console.log("Changing page to:", newPage);
      setPage(newPage);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    const maxPagesToShow = 5;
    let pages = [];
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pageButton"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={i === page ? "pageSelected" : "pageButton"}
          onClick={() => handlePageChange(i)}
          aria-current={i === page ? "page" : undefined}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="ellipsis">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          className="pageButton"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="SupportFrame" ref={topRef} style={{ zoom }}>
      <header className="SupportTextCt">
        <div className="SupportTitle">청년정책</div>
        <div className="bannerFrame">
          <div className="bannerTextCt">
            <div className="bannerText">알려드립니다</div>
            <div className="bannerText2">
              사회 초년생을 위한 지원정책을 찾아보세요!
            </div>
          </div>
          <img src={bannerImg} alt="배너 이미지" className="bannerImg" />
        </div>
        <div className="policyCategoryCt">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`policyCategory ${category === cat ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleCategoryClick(cat)
              }
              role="button"
              tabIndex={0}
              aria-label={`${cat} 카테고리 선택`}
            >
              {cat}
              {category === cat && <div className="colorBox" />}
            </div>
          ))}
        </div>
        <div className="categoryLine2" />
      </header>

      <div className="keywordContainer">
        {console.log(
          "Rendering keywords:",
          keywords,
          "isLoadingKeywords:",
          isLoadingKeywords,
          "keywordError:",
          keywordError
        )}
        {keywordError ? (
          <span className="keywordError">키워드 로드 실패: {keywordError}</span>
        ) : isLoadingKeywords ? (
          <span>키워드 로딩 중...</span>
        ) : keywords.length > 0 ? (
          keywords.map((keyword) => (
            <button
              key={keyword}
              className="policyTag"
              onClick={() => handleKeywordClick(keyword)}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                handleKeywordClick(keyword)
              }
              role="button"
              tabIndex={0}
              aria-label={`키워드 ${keyword} 검색`}
            >
              #{keyword}
            </button>
          ))
        ) : (
          <span>로그인 후 자신에게 맞는 정책 키워드를 받아보세요</span>
        )}
      </div>

      <main className="policysLine" aria-live="polite">
        {error ? (
          <div className="error" role="alert">
            {error}
          </div>
        ) : policies.length > 0 ? (
          <div className="policysCt">
            <div className="policys">
              {policies.map((policy) => (
                <article
                  key={policy.plcyNo}
                  className="policyFrame"
                  tabIndex={0}
                >
                  <span className="applicationType">
                    {policy.aplyPrdSeCd || "상시"}
                  </span>
                  <span className="policyType">
                    {policy.lclsfNm || "일자리정책"}
                  </span>
                  <h3 className="policyTitle">
                    {sanitizeHtml(truncate(policy.plcyNm, 20))}
                  </h3>
                  <p className="policytext">
                    {sanitizeHtml(truncate(policy.plcyExplnCn, 50))}
                  </p>
                  <div className="applicationTypeCt">
                    신청기간
                    <div className="applicationTypeLine" />
                    <span className="applicationType2">
                      {policy.bizPrdEtcCn || "상시"}
                    </span>
                  </div>
                  {policy.refUrlAddr1 && (
                    <button
                      className="policyView"
                      onClick={() => handlePolicyViewClick(policy)}
                      aria-label={`${policy.plcyNm} 자세히 보기`}
                    >
                      자세히 보기
                    </button>
                  )}
                  <button
                    className="policyTag"
                    onClick={() =>
                      handleTagClick(
                        `#${policy.plcyKywdNm?.split(",")[0] || "기타"}`
                      )
                    }
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      handleTagClick(
                        `#${policy.plcyKywdNm?.split(",")[0] || "기타"}`
                      )
                    }
                    aria-label={`태그 ${
                      policy.plcyKywdNm?.split(",")[0] || "기타"
                    } 검색`}
                  >
                    #{policy.plcyKywdNm?.split(",")[0] || "기타"}
                  </button>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="noPolicy" role="alert">
            검색 결과가 없습니다.
          </div>
        )}
      </main>

      <nav className="paginationFrame" aria-label="페이지 네비게이션">
        <button
          className="pageButton"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          aria-label="이전 페이지"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="paginationNumbers">{renderPagination()}</div>
        <button
          className="pageButton"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="다음 페이지"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </nav>
    </div>
  );
};

export default SupportPolicy;
